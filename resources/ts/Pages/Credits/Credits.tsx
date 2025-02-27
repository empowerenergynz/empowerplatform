/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Select,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Paginator from 'src/Components/List/Paginator';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import { Credit, CREDIT_STATUS_LABELS, CreditStatus } from 'src/Types/Credit';
import useCreditsQuery from 'src/Hooks/Queries/useCreditsQuery';
import { addBom, formatDateTime, generateCSV, saveFile } from 'src/lib';
import {
  EXPORT_CONTACTS_COLUMNS,
  EXPORT_CREDITS_COLUMNS,
  formatDataForCSV,
} from 'src/Pages/Credits/exportColums';
import { useForm } from '@inertiajs/inertia-react';
import RejectCreditModal from 'src/Pages/Credits/RejectCreditModal';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';

interface CreditPageProps {
  creditsPaginator: PaginatorType<Credit>;
  filter?: {
    status: string;
  };
}

const formatExportedLabel = (credit: Credit) =>
  CREDIT_STATUS_LABELS[CreditStatus.EXPORTED] +
  ' ' +
  formatDateTime(credit.exported_date!);

const Users = ({ creditsPaginator, filter }: CreditPageProps) => {
  const { filterStatus, processing, status } = useCreditsQuery({ filter });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const toast = useToast();
  const rejectModalDisclosure = useDisclosure();

  const [canViewAllCredits] = usePermissions([Permissions.VIEW_ALL_CREDITS]);

  // create a 'form' for changing status of selected credits
  const form = useForm({
    ids: [] as number[],
    status: CreditStatus.REQUESTED,
    admin_notes: '',
  });

  const submitNewStatus = (status: CreditStatus, adminNotes = '') => {
    form.data.ids = selectedIds;
    form.data.status = status;
    form.data.admin_notes = adminNotes;
    form.put('/credits/updateManyStatus', {
      onSuccess: () => {
        setSelectedIds([]);
        rejectModalDisclosure.onClose();
      },
    });
  };

  // toast any status change API errors which come on the redirect
  useEffect(() => {
    const description = Object.values(form.errors).join('; ');
    if (description) {
      toast({
        status: 'error',
        description,
      });
    }
  }, [form.errors, toast]);

  // disable selecting other statuses when a Credit is selected
  const [selectedStatus, setSelectedStatus] = useState<CreditStatus | null>(
    null
  );

  // create a drop-down where groups of Credits can be selected by status / exported date
  const selectableGroups = useMemo(() => {
    const list = new Set<string>(['None']);
    if (creditsPaginator.data.some((c) => c.status == CreditStatus.REQUESTED)) {
      list.add(CREDIT_STATUS_LABELS[CreditStatus.REQUESTED]);
    }
    if (creditsPaginator.data.some((c) => c.status == CreditStatus.EXPORTED)) {
      list.add(CREDIT_STATUS_LABELS[CreditStatus.EXPORTED] + ' (all)');
    }
    // create a group for each batch of credits which were exported on the same date,
    // so the same group can be selected again.
    creditsPaginator.data
      .filter((c) => c.status == CreditStatus.EXPORTED && c.exported_date)
      .forEach((c) => list.add(formatExportedLabel(c)));

    return Array.from(list);
  }, [creditsPaginator]);

  // select all the matching credits when one of the above groups is selected
  const onSelectAll = (group: string) => {
    const credits =
      group == CREDIT_STATUS_LABELS[CreditStatus.REQUESTED]
        ? creditsPaginator.data.filter(
            (c) => c.status == CreditStatus.REQUESTED
          )
        : group == CREDIT_STATUS_LABELS[CreditStatus.EXPORTED] + ' (all)'
        ? creditsPaginator.data.filter((c) => c.status == CreditStatus.EXPORTED)
        : creditsPaginator.data.filter(
            (c) =>
              c.status == CreditStatus.EXPORTED &&
              formatExportedLabel(c) == group
          );
    setSelectedIds(credits.map((c) => c.id));
    setSelectedStatus(credits[0]?.status);
  };

  const onExportRequested = () => {
    const data = creditsPaginator.data
      .filter((credit) => selectedIds.includes(credit.id))
      .map(formatDataForCSV);

    // export contacts first
    let csv = addBom(generateCSV(EXPORT_CONTACTS_COLUMNS, data));
    const date = formatDateTime(new Date(), 'yyyy-MM-dd_HH-mm');
    saveFile(csv, `contacts_${date}.csv`, 'text/csv');

    // then bill credits
    csv = addBom(generateCSV(EXPORT_CREDITS_COLUMNS, data));
    saveFile(csv, `bill_credits_${date}.csv`, 'text/csv');

    // display a quick toast before we get the next 'status change' toast
    // because the loading spinner is still spinning...
    toast({ status: 'success', description: '2 files saved' });

    // update the status
    submitNewStatus(CreditStatus.EXPORTED);
  };

  return (
    <>
      <Box
        as="h1"
        data-testid="page-title"
        color="primary.700"
        textStyle="h2"
        mb="10px"
      >
        Energy Bill Credits
      </Box>
      <Flex mt={2} mb={6} gap={2} justifyContent="space-between">
        <Select
          width="130px"
          data-testid="credit-status-filter"
          size="md"
          fontSize="md"
          placeholder="Status"
          objectPosition="right"
          icon={<ChevronDownIcon />}
          onChange={(e) => filterStatus(e.target.value)}
          defaultValue={status || ''}
          color="gray.700"
          _placeholder={{ color: 'gray.700' }}
          fontWeight={600}
        >
          {CREDIT_STATUS_LABELS.map((value, index) => (
            <option key={value} value={index}>
              {value}
            </option>
          ))}
        </Select>
        {canViewAllCredits && (
          <Select
            width="230px"
            data-testid="credit-select-filter"
            size="md"
            fontSize="md"
            placeholder="Select..."
            objectPosition="right"
            icon={<ChevronDownIcon />}
            value=""
            onChange={(e) => onSelectAll(e.target.value)}
            color="gray.700"
            _placeholder={{ color: 'gray.700' }}
            fontWeight={600}
            isDisabled={form.processing}
          >
            {selectableGroups.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        )}
        <Box flexGrow={1} />
        {selectedStatus == CreditStatus.REQUESTED ? (
          <Button
            variant="solidPrimary"
            onClick={onExportRequested}
            disabled={form.processing}
            isLoading={
              form.processing && form.data.status == CreditStatus.EXPORTED
            }
          >
            Export Contacts and Credits for Xero
          </Button>
        ) : selectedStatus == CreditStatus.EXPORTED ? (
          <Button
            variant="solidPrimary"
            onClick={() => submitNewStatus(CreditStatus.PAID)}
            disabled={form.processing}
            isLoading={form.processing && form.data.status == CreditStatus.PAID}
          >
            Mark as Paid
          </Button>
        ) : null}
        {selectedIds.length > 0 && (
          <Button
            colorScheme="red"
            onClick={() => rejectModalDisclosure.onOpen()}
            disabled={form.processing}
          >
            Reject
          </Button>
        )}
      </Flex>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {canViewAllCredits && <Th width="0"></Th>}
              <Th>Date</Th>
              {canViewAllCredits && <Th>Agency</Th>}
              <Th>Name</Th>
              <Th isNumeric>Amount</Th>
              <Th>Retailer</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {processing ? (
              [1, 2, 3].map((i) => (
                <Tr key={i}>
                  <Td colSpan={10}>
                    <Skeleton width="100%" height="17px" />
                  </Td>
                </Tr>
              ))
            ) : creditsPaginator.data.length > 0 ? (
              creditsPaginator.data.map((credit) => (
                <Tr key={credit.id} data-testid={'credit-row-' + credit.id}>
                  {canViewAllCredits && (
                    <Td>
                      <Checkbox
                        value={credit.id}
                        isChecked={selectedIds.includes(credit.id)}
                        onChange={(e) => {
                          const newIds = e.target.checked
                            ? [...selectedIds, credit.id]
                            : selectedIds.filter((id) => id != credit.id);
                          setSelectedIds(newIds);
                          // so we can disable selecting other statuses
                          setSelectedStatus(
                            newIds.length ? credit.status : null
                          );
                        }}
                        isDisabled={
                          form.processing ||
                          // only allow rows with the same status to be selected
                          (selectedIds.length > 0 &&
                            credit.status !== selectedStatus)
                        }
                        data-testid={'credit-checkbox-' + credit.id}
                      />
                    </Td>
                  )}
                  <Td>{formatDateTime(credit.created_at!)}</Td>
                  {canViewAllCredits && <Td>{credit.agency?.name}</Td>}
                  <Td>{credit.name}</Td>
                  <Td isNumeric>
                    {credit.notes ? (
                      <Tooltip label={credit.notes}>
                        <Box as="span" borderBottom="1px dashed">
                          ${credit.amount}
                        </Box>
                      </Tooltip>
                    ) : (
                      '$' + credit.amount
                    )}
                  </Td>
                  <Td>{credit.retailer?.name}</Td>
                  <Td>
                    {credit.status == CreditStatus.REJECTED ? (
                      <Tooltip label={credit.admin_notes}>
                        <Box as="span" borderBottom="1px dashed">
                          {CREDIT_STATUS_LABELS[credit.status]}
                        </Box>
                      </Tooltip>
                    ) : (
                      CREDIT_STATUS_LABELS[credit.status]
                    )}
                    {credit.status == CreditStatus.EXPORTED &&
                      credit.exported_date && (
                        <small>
                          {` (${formatDateTime(credit.exported_date)})`}
                        </small>
                      )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={10} textAlign="center">
                  No Credits
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Spacer />
      {selectedIds.length ? (
        <Box mt="20px" height="24px" textAlign="center">
          Cannot change page while rows are selected
        </Box>
      ) : (
        <Paginator paginator={creditsPaginator} />
      )}
      <RejectCreditModal
        disclosure={rejectModalDisclosure}
        onSubmit={(reason) => {
          submitNewStatus(CreditStatus.REJECTED, reason);
        }}
        processing={form.processing}
      />
    </>
  );
};

Users.layout = (page: ReactElement) => <AppLayout children={page} />;

export default Users;
