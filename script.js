const rangeSlider = document.querySelector(".slider-container .price-slider");
const rangeInputs = document.querySelectorAll(".range-input input");
const numberInputs = document.querySelectorAll(".price-input input");

const min = 2;
const max = 50;
const initialMinValue = Math.floor(min + (max - min) / 4);
const initialMaxValue = Math.ceil(min + (3 * (max - min)) / 4);

numberInputs.forEach((input) => {
  input.min = min;
  input.max = max;
});

numberInputs[0].value = initialMinValue;
numberInputs[1].value = initialMaxValue;
rangeInputs[0].min = min;
rangeInputs[0].max = max;
rangeInputs[1].min = min;
rangeInputs[1].max = max;
rangeInputs[0].value = initialMinValue;
rangeInputs[1].value = initialMaxValue;

function updateSliderPosition() {
  const minVal = parseInt(rangeInputs[0].value);
  const maxVal = parseInt(rangeInputs[1].value);
  const leftPercent = ((minVal - min) / (max - min)) * 100;
  const rightPercent = 100 - ((maxVal - min) / (max - min)) * 100;
  rangeSlider.style.left = `${leftPercent}%`;
  rangeSlider.style.right = `${rightPercent}%`;
}

numberInputs.forEach((input, i) => {
  input.addEventListener("input", () => {
    const minp = parseInt(numberInputs[0].value);
    const maxp = parseInt(numberInputs[1].value);
    if (minp > maxp) {
      numberInputs[i].value = i === 0 ? maxp : minp;
    }
    rangeInputs[i].value = numberInputs[i].value;
    updateSliderPosition();
  });
});

rangeInputs.forEach((input, i) => {
  input.addEventListener("input", () => {
    const minVal = parseInt(rangeInputs[0].value);
    const maxVal = parseInt(rangeInputs[1].value);
    if (minVal > maxVal) {
      rangeInputs[i].value = i === 0 ? maxVal : minVal;
    }
    numberInputs[i].value = rangeInputs[i].value;
    updateSliderPosition();
  });
});

function fetchWord() {
  const minLength = parseInt(document.getElementById("min-range").value);
  const maxLength = parseInt(document.getElementById("max-range").value);
  const isSingleWord = document.getElementById("singleWord").checked;
  const filePath = "TDK_Sözlük_Kelime_Listesi.txt";

  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      const lines = data.split("\n").filter((line) => line.trim());
      const filteredLines = lines.filter((line) => {
        const trimmedLine = line.trim();
        const wordLength = trimmedLine.length;
        return wordLength >= minLength && wordLength <= maxLength && (!isSingleWord || !trimmedLine.includes(" "));
      });

      if (filteredLines.length === 0) {
        document.getElementById("result").innerHTML = "Belirtilen uzunluklarda kelime bulunamadı.";
        return;
      }

      const randomLine = filteredLines[Math.floor(Math.random() * filteredLines.length)];
      fetch(`https://sozluk.gov.tr/gts_id?id=${randomLine}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const item = data[0];
            const anlamlar = item.anlamlarListe.map((anlamObj) => anlamObj.anlam).join("<br>");
            document.getElementById("result").innerHTML = `
                              <p><strong>Kelime:</strong> ${randomLine}</p>
                              <p><strong>Anlamlar:</strong> ${anlamlar}</p>
                          `;
          } else {
            document.getElementById("result").innerHTML = "Veri bulunamadı.";
          }
        })
        .catch((error) => {
          console.error("Bir hata oluştu:", error);
          document.getElementById("result").innerHTML = "Bir hata oluştu.";
        });
    })
    .catch((error) => {
      console.error("Dosya okunurken bir hata oluştu:", error);
      document.getElementById("result").innerHTML = "Dosya okunurken bir hata oluştu.";
    });
}

updateSliderPosition();
