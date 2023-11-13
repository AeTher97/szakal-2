import useMediaQuery from '@mui/material/useMediaQuery';


export const useMobileSize = () => {

    return useMediaQuery("@media (max-width:500px)")
}
