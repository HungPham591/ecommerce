const colors = [
  "#FFBABA",
  "#FFE0BA",
  "#ECFFBA",
  "#CAFFBA",
  "#BAFFD7",
  "#BAFFF6",
  "#BAE9FF",
  "#BAC6FF",
  "#BFBAFF",
  "#DDBAFF",
  "#F9BAFF",
  "#FFBAE2",
  "#FFBAD3",
  "#DEA9AF",
];

const categoryColorMap = (name, plus = null) => {
  let color =
    colors[
      (name.charCodeAt(0) +
        name.charCodeAt(1) +
        name.charCodeAt(2) +
        name.charCodeAt(name.length - 1)) %
        colors.length
    ];
  const oldColor = color;

  if (plus) {
    color = color
      .split("")
      .map((char, ind) => {
        if (ind === 0) return char;
        if (parseInt(char)) {
          let num = parseInt(char);
          num = Math.max(0, Math.min(num + plus, 9));
          return num.toString();
        }
        return char;
      })
      .join("");
  }

  return color;
};

export default categoryColorMap;
