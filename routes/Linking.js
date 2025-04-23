const linking = {
    prefixes: ['myntraclone://', 'https://myntraclone.com'], 
    config: {
      screens: {
        Splash: 'splash',
        MainApp: {
          screens: {
            Home: {
              screens: {
                HomeMain: 'home',
                Profile: 'profile',
              },
            },
            FWD: 'fwd',
            Luxury: 'luxury',
            Bag: 'cart',
          },
        },
        OtpVerification: 'otp',
        adduser: 'add-user',
        ProductDetail: 'product/:id',
        wishlist: 'wishlist',
      },
    },
  };
  
  export default linking