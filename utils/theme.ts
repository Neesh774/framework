import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: true
}

const theme = extendTheme({
    config,
    colors: {
        primary: {
            main: "#9F9DFF",
            50: "#D6D5FF",
            100: "#E4E3FF",
            200: "#BBBAFF",
            300: "#B4B3FF",
            400: "#A7A5FF",
            500: "#7A73FF",
            600: "#8381FF",
            700: "#6663FF",
            800: "#2C28FF",
            900: "#0300B1"
        }
    },
    components: {
        Divider: {
            baseStyle: {
                borderColor: "primary.400"
            }
        },
    }
})

export default theme