import { loadEthinicities, loadProducts, loadProvinces } from "@/services/commonService"
import { useQuery } from "@tanstack/react-query"

export const useProvinceList = (token: string) => {
	return useQuery({
		queryKey: ['provinces'],
		queryFn: () => loadProvinces(token),
		enabled: !!token
	})
}

export const useEthnicityList = (token: string) => {
	return useQuery({
		queryKey: ['ethinicities'],
		queryFn: () => loadEthinicities(token),
		enabled: !!token
	})
}

export const useProductList = (token: string) => {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => loadProducts(token),
		enabled: !!token
	})
}