import React, { useEffect, useState } from 'react';
import { getAccessToken, isAuthenticated, getUser } from '../../utils/authStorage';
import { adminPaymentService } from '../../services/adminPaymentService';

export const PaymentsDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const runDebugTests = async () => {
      // Check authentication state
      const authInfo = {
        isAuthenticated: isAuthenticated(),
        accessToken: getAccessToken(),
        user: getUser(),
      };

      setDebugInfo(authInfo);

      // Test API calls if authenticated
      if (authInfo.isAuthenticated && authInfo.accessToken) {
        try {
          console.log('Testing payments API...');
          const payments = await adminPaymentService.fetchPayments();
          setTestResults({
            success: true,
            paymentsCount: payments.length,
            firstPayment: payments[0] || null,
          });
        } catch (error: any) {
          setTestResults({
            success: false,
            error: error.message,
            stack: error.stack,
          });
        }
      }
    };

    runDebugTests();
  }, []);

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-4">Payments Debug Information</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Authentication Status:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {debugInfo.isAuthenticated && (
          <div>
            <h3 className="font-semibold">API Test Results:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {!debugInfo.isAuthenticated && (
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-yellow-800">User is not authenticated. Please log in first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsDebug;