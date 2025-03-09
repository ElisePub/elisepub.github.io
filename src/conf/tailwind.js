tailwind.config = {
    theme: {
      extend: {
        colors: {
          'white' : '#efefef',
          'dark' : {
            DEFAULT: '#0d1117',
            300: '#24272C'
          },
          'blue' : {
            DEFAULT: '#815bff',
            600: '#6242cb',
            800: '#344661'
          },
          'purple' : '#b55bff'
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        }
      }
    }
  }