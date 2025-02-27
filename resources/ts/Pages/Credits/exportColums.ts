/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-non-null-assertion */
import { Credit } from 'src/Types/Credit';
import { addDays, format } from 'date-fns';

const MAX_LEN = 12;

export const formatDataForCSV = (credit: Credit) => {
  const nameSplit = credit.name.split(' ').filter((n) => n);
  const lastName = nameSplit.pop()!;
  const firstName = nameSplit.join(' ');
  const secondName = nameSplit[1] || '';
  const retailer = credit.retailer!;
  const date = new Date(credit.created_at!);
  const replaceStuff = (template = '') =>
    template
      .replace('_accountNo', credit.account)
      .replace('_name', credit.name)
      .replace('_surname', lastName)
      .replace('_firstname', firstName)
      .replace('_i', firstName[0] || '')
      .replace('_j', secondName[0] || '')
      .replace('_year', date.getFullYear().toString())
      // remove any double spaces
      .replace(/  +/g, ' ');

  const data: Partial<
    Record<
      | (typeof EXPORT_CONTACTS_COLUMNS)[number]
      | (typeof EXPORT_CREDITS_COLUMNS)[number],
      string
    >
  > = {
    // Both
    '*ContactName': credit.name + '-' + credit.account,
    EmailAddress: retailer.email || '',

    // Contacts
    FirstName: firstName,
    LastName: lastName,
    BankAccountName: retailer.account_name,
    BankAccountNumber: retailer.account_number,
    BankAccountParticulars: replaceStuff(retailer.particulars)
      .substring(0, MAX_LEN)
      .trim(),
    BankAccountCode: replaceStuff(retailer.code).substring(0, MAX_LEN).trim(),
    BankAccountReference: replaceStuff(retailer.reference)
      .substring(0, MAX_LEN)
      .trim(),

    // Credits
    '*InvoiceNumber': 'CRD-' + credit.id,
    '*InvoiceDate': format(date, 'dd/MM/yyyy'),
    '*DueDate': format(addDays(date, 2), 'dd/MM/yyyy'),
    '*AccountCode': '300',
    '*TaxType': 'No GST',
    TrackingName1: 'Agency',
    TrackingOption1: credit.agency?.name || '',
    TrackingName2: 'District',
    // replace accents in District names, just in case this breaks Xero
    TrackingOption2: `${credit.region?.name || ''} / ${
      credit.district?.name || ''
    }`
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, ''),
    '*Quantity': '1',
    '*UnitAmount': credit.amount.toString(),
    Currency: 'NZD',
    Description: 'Empower Energy Credit',
  };
  return data;
};

// the Contacts' details need to be imported into Xero before the Credits can be imported
export const EXPORT_CONTACTS_COLUMNS = [
  '*ContactName', // Full Name + Contact's Electricty Account Number (must match below)
  'AccountNumber',
  'EmailAddress', // retailer email, if there is one
  'FirstName', // first name
  'LastName', // last name
  'POAttentionTo',
  'POAddressLine1',
  'POAddressLine2',
  'POAddressLine3',
  'POAddressLine4',
  'POCity',
  'PORegion',
  'POPostalCode',
  'POCountry',
  'SAAttentionTo',
  'SAAddressLine1',
  'SAAddressLine2',
  'SAAddressLine3',
  'SAAddressLine4',
  'SACity',
  'SARegion',
  'SAPostalCode',
  'SACountry',
  'PhoneNumber',
  'FaxNumber',
  'MobileNumber',
  'DDINumber',
  'SkypeName',
  'BankAccountName', // Retailer's
  'BankAccountNumber', // Retailer's
  'BankAccountParticulars', // Retailer's
  'BankAccountCode', // Retailer's
  'BankAccountReference', // Retailer's
  'TaxNumber',
  'AccountsReceivableTaxCodeName',
  'AccountsPayableTaxCodeName',
  'Website',
  'LegalName',
  'CompanyNumber',
  'DueDateBillDay',
  'DueDateBillTerm',
  'DueDateSalesDay',
  'DueDateSalesTerm',
  'SalesAccount',
  'PurchasesAccount',
  'TrackingName1',
  'SalesTrackingOption1',
  'PurchasesTrackingOption1',
  'TrackingName2',
  'SalesTrackingOption2',
  'PurchasesTrackingOption2',
  'BrandingTheme',
  'DefaultTaxBills',
  'DefaultTaxSales',
  'Person1FirstName',
  'Person1LastName',
  'Person1Email',
  'Person1IncludeInEmail',
  'Person2FirstName',
  'Person2LastName',
  'Person2Email',
  'Person2IncludeInEmail',
  'Person3FirstName',
  'Person3LastName',
  'Person3Email',
  'Person3IncludeInEmail',
  'Person4FirstName',
  'Person4LastName',
  'Person4Email',
  'Person4IncludeInEmail',
  'Person5FirstName',
  'Person5LastName',
  'Person5Email',
  'Person5IncludeInEmail',
] as const;

export const EXPORT_CREDITS_COLUMNS = [
  '*ContactName', // Full Name + Contact's electricity Account Number (must match above)
  'EmailAddress', // retailer email, if there is one
  'POAddressLine1',
  'POAddressLine2',
  'POAddressLine3',
  'POAddressLine4',
  'POCity',
  'PORegion',
  'POPostalCode',
  'POCountry',
  '*InvoiceNumber', // CRD-[credit.id]
  '*InvoiceDate', // date credit requested DD/MM/YYYY (according to https://central.xero.com/s/article/Import-bills-and-credit-notes)
  '*DueDate', // date credit requested + 2 days
  'InventoryItemCode',
  'Description', // 'Empower Energy Credit'
  '*Quantity', // '1'
  '*UnitAmount', // credit.amount
  '*AccountCode', // '300'
  '*TaxType', // 'No GST'
  'TrackingName1', // 'Agency'
  'TrackingOption1', // agency.name
  'TrackingName2', // District
  'TrackingOption2', // region.name + '/' +  district.name
  'Currency', // 'NZD'
] as const;
