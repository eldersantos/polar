export type ThemePreset = 'polar' | 'midday'

export interface PolarThemingPresetProps {
  input: string
  button: string
  checkbox: string
  dropdown: string
  dropdownContent: string
  dropdownItem: string
  checkoutWrapper: string
  checkoutInnerWrapper: string
  checkoutCardWrapper: string
  checkoutProductSwitch: string
  checkoutProductSwitchSelected: string
}

export type StripeThemingPresetProps = Record<string, unknown>

export interface ThemingPresetProps {
  polar: PolarThemingPresetProps
  stripe: StripeThemingPresetProps
}

export const useThemePreset = (
  preset: ThemePreset,
  theme?: 'light' | 'dark',
): ThemingPresetProps => {
  switch (preset) {
    case 'polar':
      const inputBoxShadow =
        theme === 'dark'
          ? 'none'
          : 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
      const focusBoxShadow =
        theme === 'dark'
          ? 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 71, 184, 0.4) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'
          : 'rgb(255, 255, 255) 0px 0px 0px 0px, rgb(204, 224, 255) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px'

      return {
        stripe: {
          theme: theme === 'dark' ? 'night' : 'stripe',
          rules: {
            '.Label': {
              color: theme === 'dark' ? 'white' : 'black',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '8px',
            },
            '.PickerItem': {
              padding: '12px',
              backgroundColor: theme === 'dark' ? 'rgb(28 28 34)' : 'white',
              color: theme === 'dark' ? '#E5E5E1' : '#181A1F',
              borderRadius: '0.75rem',
              boxShadow: inputBoxShadow,
              borderColor: 'transparent',
            },
            '.PickerItem--selected': {
              backgroundColor: theme === 'dark' ? 'rgb(28 28 34)' : 'white',
              borderColor: '#0062FF',
              borderWidth: '2px',
            },
            '.PickerItem--selected:hover': {
              backgroundColor: theme === 'dark' ? 'rgb(28 28 34)' : 'white',
            },
            '.Input': {
              padding: '12px',
              backgroundColor: theme === 'dark' ? 'rgb(25, 25, 29)' : 'white',
              color: theme === 'dark' ? '#E5E5E1' : '#181A1F',
              borderRadius: '0.75rem',
              borderColor: theme === 'dark' ? 'rgb(36, 36.5, 40.5)' : '#EEE',
              boxShadow: inputBoxShadow,
            },
            '.Input:focus': {
              borderColor:
                theme === 'dark' ? 'rgb(0, 84, 219)' : 'rgb(102, 161, 255)',
              boxShadow: focusBoxShadow,
            },
            '.Tab': {
              backgroundColor: theme === 'dark' ? 'rgb(25, 25, 29)' : 'white',
              borderColor: theme === 'dark' ? 'rgb(36, 36.5, 40.5)' : '#EEE',
            },
            '.Tab--selected': {
              backgroundColor: 'rgb(51, 129, 255)',
              boxShadow: focusBoxShadow,
              border: 'none',
            },
            '.Tab:focus': {
              boxShadow: focusBoxShadow,
            },
            '.TabLabel--selected': {
              color: 'white',
            },
            '.TabIcon--selected': {
              fill: 'white',
            },
            '.Block': {
              backgroundColor: 'transparent',
              borderColor: theme === 'dark' ? '#353641' : '#EEE',
            },
          },
          variables: {
            borderRadius: '8px',
            fontSizeBase: '0.875rem',
            spacingGridRow: '18px',
            colorDanger: theme === 'dark' ? '#F17878' : '#E64D4D',
          },
        },
        polar: {
          input: 'bg-white shadow-sm',
          button: '',
          dropdown: '',
          dropdownContent: '',
          dropdownItem: '',
          checkbox: '',
          checkoutWrapper: 'dark:bg-polar-950 bg-gray-100 dark:text-white',
          checkoutInnerWrapper: 'rounded-3xl dark:md:bg-polar-900 md:bg-white',
          checkoutCardWrapper:
            'dark:bg-polar-800 dark:border-polar-700 rounded-3xl bg-white shadow-xl',
          checkoutProductSwitch:
            'rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900',
          checkoutProductSwitchSelected: 'bg-blue-50 dark:bg-blue-950',
        },
      }
    case 'midday':
      return {
        stripe: {
          theme: 'night',
          rules: {
            '.Label': {
              color: 'white',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '8px',
            },
            '.PickerItem': {
              padding: '12px',
              backgroundColor: '#1d1d1d',
              color: 'white',
              borderRadius: '0',
              borderColor: 'transparent',
              boxShadow: '0 0 0 transparent',
            },
            '.PickerItem:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '.PickerItem--selected': {
              backgroundColor: 'white',
              borderColor: '#0062FF',
              borderWidth: '2px',
            },
            '.PickerItem--selected:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '.Input': {
              padding: '12px',
              backgroundColor: '#1d1d1d',
              color: 'white',
              borderRadius: '0',
              border: 'none',
              boxShadow: '0 0 0 transparent',
            },
            '.Input:focus': {
              border: 'none',
              boxShadow: '0 0 0 transparent',
            },
            '.Tab': {
              backgroundColor: '#1d1d1d',
              border: 'none',
              boxShadow: '0 0 0 transparent',
            },
            '.Tab--selected': {
              backgroundColor: 'rgb(51, 129, 255)',
              border: 'none',
              boxShadow: '0 0 0 transparent',
            },
            '.Tab:focus': {},
            '.TabLabel--selected': {
              color: 'white',
              border: 'none',
              boxShadow: '0 0 0 transparent',
            },
            '.TabIcon--selected': {
              fill: 'white',
            },
            '.Block': {
              backgroundColor: 'transparent',
              borderColor: '#2c2c2c',
            },
          },
          variables: {
            borderRadius: '0',
            fontSizeBase: '0.875rem',
            spacingGridRow: '18px',
            colorDanger: '#F17878',
          },
        },
        polar: {
          input: 'rounded-none bg-[#1d1d1d] dark:bg-[#1d1d1d] border-none',
          button:
            'rounded-none bg-white dark:bg-white text-black dark:text-black',
          dropdown:
            'bg-[#1d1d1d] dark:bg-[#1d1d1d] border-none rounded-none hover:bg-[rgba(255,255,255,.1)] dark:hover:bg-[rgba(255,255,255,.1)]',
          dropdownContent: 'bg-[#1d1d1d] dark:bg-[#1d1d1d] !rounded-none',
          checkbox: 'rounded-none',
          dropdownItem: '!rounded-none',
          checkoutWrapper: 'bg-[#0c0c0c] dark:bg-[#0c0c0c] text-white',
          checkoutInnerWrapper:
            'md:bg-[#121212] dark:md:bg-[#121212] md:!rounded-none',
          checkoutCardWrapper:
            'dark:bg-[#1d1d1d] bg-[#1d1d1d] border-none !rounded-none text-white',
          checkoutProductSwitch:
            '!rounded-none bg-[#1d1d1d] hover:bg-[#2c2c2c]',
          checkoutProductSwitchSelected: 'bg-white text-black',
        },
      }
  }
}
