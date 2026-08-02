export default {
  theme: {
    extend: {
      colors: {
        canvas: '#F3F7F5', surface: '#FFFFFF', ink: '#172521', muted: '#687A74', border: '#DDE7E2',
        sea: '#075F78', 'sea-deep': '#06384F', turquoise: '#1597A8', mist: '#DDF4F2',
        success: '#1F9D72', sand: '#FFF4CE', danger: '#C45B59', 'danger-soft': '#FFF7F6',
        'danger-border': '#E8D2D1', 'running-indicator': '#D8F46C',
        'portfolio-start': '#22A77D', 'portfolio-end': '#096149', 'experience-start': '#EF8B63',
        'experience-end': '#AD3F26', 'callumployed-start': '#648BDC', 'callumployed-end': '#294D9B',
        'nourish-start': '#65B984', 'nourish-end': '#237044',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)', 'page-mobile': '1.25rem', 'page-tablet': '2rem',
        'page-desktop': '4rem', 'header-mobile': '1.5rem', 'header-desktop': '2.375rem',
        'page-bottom': 'calc(2.5rem + env(safe-area-inset-bottom))', 'page-top': 'calc(1.5rem + env(safe-area-inset-top))',
        'background-large': '34rem', 'background-medium': '32rem', 'icon-art': '58%',
      },
      borderRadius: { app: '27%', panel: '2rem' },
      boxShadow: {
        app: '0 18px 36px rgb(23 37 33 / 16%), inset 0 0 0 1px rgb(255 255 255 / 22%)',
        'app-hover': '0 22px 42px rgb(23 37 33 / 20%), inset 0 0 0 1px rgb(255 255 255 / 24%)',
        panel: '0 24px 70px rgb(30 65 53 / 8%)', brand: '0 8px 20px rgb(6 56 79 / 16%)',
      },
      fontSize: { eyebrow: ['0.625rem', '0.875rem'], micro: ['0.6875rem', '1rem'] },
      letterSpacing: { eyebrow: '0.22em', label: '0.2em', title: '-0.055em', brand: '-0.035em' },
    },
  },
}
