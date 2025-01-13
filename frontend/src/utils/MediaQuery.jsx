import useMediaQuery from '@mui/material/useMediaQuery';


export const useMobileSize = () => {
    return useMediaQuery("(max-width:500px)")
}

export const useMediumSize = () => {
    return useMediaQuery("(max-width:1200px)")
}
