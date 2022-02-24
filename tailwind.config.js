module.exports = {
	content: ["./public/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				dark: "#151515",
				darkBlue: "#1E283A",
				errorRed: "#CB3936",
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
