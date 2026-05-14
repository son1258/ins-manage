import { loadProviders } from "@/services/providerService"
import { useQuery } from "@tanstack/react-query"

export const useProviderList = (token: string) => {
	return useQuery({
		queryKey: ['provider'],
		queryFn: () => loadProviders(token),
		enabled: !!token
	})
}