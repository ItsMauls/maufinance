/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,ejs}",
  "./views/*/*.{html,js,ejs}"],
  theme: {
    extend: { 
      fontFamily : {
        'QuickSand':[ 'Quicksand', 'sans-serif'],
        'Montserrat' : ['Montserrat', 'sans-serif'],
        'Concertt' : ['Concert One', 'cursive']
      }
  },
  },
  plugins: [],
}
