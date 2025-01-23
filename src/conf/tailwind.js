tailwind.config = {
    theme: {
      extend: {
        colors: {
          'white' : '#efefef',
          'dark' : '#0d1117',
          'blue' : {
            DEFAULT: '#815bff',
            700: '#6242cb'
          },
          'purple' : '#b55bff'
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        }
      }
    }
  }