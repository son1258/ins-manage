import { loadOrderById, loadOrders } from "@/services/orderService"
import { useQuery } from "@tanstack/react-query"

export const useOrderList = (params: any, token: string) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => loadOrders(params, token),
		enabled: !!token
	})
}

export const useOrderDetail = (id: string, token: string) => {
	return useQuery({
		queryKey: ['order-detal', id],
		queryFn: () => loadOrderById(id, token),
		enabled: !!token
	})
} 