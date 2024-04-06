import { useGetDefaultCdtCodesQuery, useGetCustomCdtCodesQuery } from '../../Redux/ReduxSlices/CdtCodes/cdtCodesApiSlice';
import { useMemo } from 'react';

export const useCombinedCdtCodes = () => {
    const { data: defaultCdtCodes, error: defaultError, isLoading: defaultLoading } = useGetDefaultCdtCodesQuery();
    const { data: customCdtCodes, error: customError, isLoading: customLoading } = useGetCustomCdtCodesQuery();

    const isLoading = defaultLoading || customLoading;
    const error = defaultError || customError;
    const combinedCdtCodes = useMemo(() => {
        if (!defaultCdtCodes || !customCdtCodes) return [];
        return [...defaultCdtCodes, ...customCdtCodes];
    }, [defaultCdtCodes, customCdtCodes]);

    return { combinedCdtCodes, isLoading, error };
};
