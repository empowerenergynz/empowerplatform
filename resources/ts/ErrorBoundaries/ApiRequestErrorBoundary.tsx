import React from 'react';
import axios, { AxiosError } from 'axios';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
} from '@chakra-ui/react';
import { ErrorResponse } from 'src/Types/Responses';

interface ErrorBoundaryState {
  error: AxiosError<ErrorResponse> | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class ApiRequestErrorBoundary extends React.Component<any, any> {
  public readonly state: ErrorBoundaryState = {
    error: null,
  };

  componentDidCatch(error: Error): void {
    if (axios.isCancel(error)) return;

    if (!axios.isAxiosError(error)) {
      throw error;
    }
    this.setState({ error });
  }

  private _handleClickHome = (): void => {
    window.location.assign('/');
  };

  private _getDescription(): string {
    const { error } = this.state;
    switch (error?.response?.status) {
      case 404:
        return 'The requested page could not be found';
      default:
        return 'An unknown error occurred';
    }
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <Flex py={8} minH="100%" justifyContent="center" alignItems="center">
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            maxW="96"
            data-testid="api-error"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Something went wrong!
            </AlertTitle>
            <AlertDescription maxWidth="sm" mb="4">
              {this._getDescription()}
            </AlertDescription>
            <Button onClick={this._handleClickHome} borderRadius="0">
              Back Home
            </Button>
          </Alert>
        </Flex>
      );
    }

    return children;
  }
}
