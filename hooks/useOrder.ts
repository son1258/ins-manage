import { loadOrderById, loadOrders, upDateOrder } from "@/services/orderService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useOrderList = (params: any, token: string) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => loadOrders(params, token),
		enabled: !!token
	})
}

export const useOrderDetail = (id: string, token: string) => {
	return useQuery({
		queryKey: ['order-detail', id],
		queryFn: () => loadOrderById(id, token),
		enabled: !!token
	})
}

export const useUpdateOrderDetail = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => upDateOrder(data, token),
		onSuccess: (resp, variables) => {
			if (resp && resp.success) {
				queryClient.invalidateQueries({
					queryKey: ['order-detail', variables.id]
				});
				queryClient.invalidateQueries({
					queryKey: ['orders']
				});
			}
		}
	})
}