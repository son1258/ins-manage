import { loadListOrderByBatchPaymentId } from "@/services/orderService"
import { acceptPayment, loadPayments, terminatePayment } from "@/services/paymentService"
import { handleApiError } from "@/utils/errorHandler"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const usePaymentList = (params: any, token: string) => {
	return useQuery({
		queryKey: ['payments', params],
		queryFn: () => loadPayments(params, token),
		enabled: !!token
	})
}

export const useTerminatePaymentMutation = (token: string, t: any) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => terminatePayment(data, token),
		onSuccess: () => {
			toast.success(t('success'));
			queryClient.invalidateQueries({queryKey: ['payments']});
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: (err) => {
			handleApiError(err, t);
		}
	})
}

export const useAcceptPaymentMutation = (token: string, t: any) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => acceptPayment(data, token),
		onSuccess: () => {
			toast.success(t('success'));
			queryClient.invalidateQueries({queryKey: ['payments']});
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: (err) => {
			handleApiError(err, t);
		}
	})
}

export const useListOrdersInBatchPayment = (data: any, token: string) => {
	return useQuery({
		queryKey: ['orders-by-payment', data],
		queryFn: () => loadListOrderByBatchPaymentId(data, token),
		enabled: !!token && !!data.batchPaymentId
	})
} 