function addTextToImage(imagePath, textObjs, width) {
    const circle_canvas = document.getElementById("canvas");
    const context = circle_canvas.getContext("2d");

    // Draw Image function
    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
        let imgRatio = img.naturalHeight / img.naturalWidth,
            height = width * imgRatio;
        circle_canvas.width = width;
        circle_canvas.height = width * imgRatio;
        context.drawImage(img, 0, 0, width, height);
        textObjs.forEach(textObj => {
            let heightRel = (height/textObj.fontSize) + textObj.textHeight;
            context.save();
            context.lineWidth = 1;
            context.fillStyle = textObj.fillStyle;
            context.font = textObj.fontWeight +" "+ width / textObj.fontSize + "px 'goodVibrations'";
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            if (textObj.sideWays) {
                context.rotate(Math.PI / 2);
                heightRel = (width/textObj.fontSize) + textObj.textHeight;
                height = 0;
                width = width*imgRatio;
            }
            context.fillText(textObj.text, width / 2, height / 2 - heightRel);
            context.restore();
        })

    };
}

$(document).ready(function () {
    [...document.getElementsByClassName('mdc-text-field')].forEach(el => {
        mdc.textField.MDCTextField.attachTo(el);
    })
    $('#label-form').on('input', function () {
        addTextToImage("/images/Viinamari.png", [
            {
                text: $(this)[0][0].value,
                fontSize: 6,
                textHeight: 5,
                fillStyle: "#696969",
                fontWeight: '',
                sideWays: false
            },
            {
                text: $(this)[0][1].value,
                fontSize: 15,
                textHeight: -250,
                fillStyle: "#000000",
                fontWeight: 'bold',
                sideWays: false
            },
            {
                text: $(this)[0][2].value,
                fontSize: 15,
                textHeight: 8,
                fillStyle: "#000000",
                fontWeight: 'bold',
                sideWays: true
            }
        ], 440);
    });
    addTextToImage("/images/Viinamari.png", [
            {
                text: "Viinamarjavein",
                fontSize: 6,
                textHeight: 5,
                fillStyle: "#696969",
                fontWeight: '',
                sideWays: false
            },
            {
                text: "2022",
                fontSize: 15,
                textHeight: -250,
                fillStyle: "#000000",
                fontWeight: 'bold',
                sideWays: false
            },
            {
                text: "750ml",
                fontSize: 15,
                textHeight: 8,
                fillStyle: "#000000",
                fontWeight: 'bold',
                sideWays: true
            }
        ], 440);
})
