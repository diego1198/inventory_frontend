"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      duration={4000}
      toastOptions={{
        style: {
          padding: '16px',
          fontSize: '15px',
          fontWeight: '500',
          borderRadius: '8px',
          border: '1px solid',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        classNames: {
          error: 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
          success: 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800',
          warning: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800',
          info: 'bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
