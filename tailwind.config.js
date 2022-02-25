module.exports = {
	content: ["./public/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				dark: "#151515",
				darkTwo: "#282828",
				darkThree: "#1a1a1a",
				darkBlue: "#1E283A",
				errorRed: "#ff3333",
				errorDarkRed: "#602020",
			},
			fontSize: {
				tiny: [
					".75rem",
					{
						letterSpacing: "0.08em",
					},
				],
			},
		},
	},
	plugins: [],
};
