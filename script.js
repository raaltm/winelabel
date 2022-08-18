const textObjs = {
    title: {
        text: "Viinamarjavein",
        fontSize: 6,
        textHeight: 2.6,
        fillStyle: "#696969",
        fontWeight: '',
        sideWays: false
    },
    year: {
        text: "2022",
        fontSize: 15,
        textHeight: 1.085,
        fillStyle: "#000000",
        fontWeight: 'bold',
        sideWays: false
    },
    volume:  {
        text: "750ml",
        fontSize: 15,
        textHeight: 8,
        fillStyle: "#000000",
        fontWeight: 'bold',
        sideWays: true
    }
}
let logoPath = 'images/Viinamari.png';
function addTextToImage(logoPath, textObjs, width) {
    const imageSrc = '/images/label.png';
    const circle_canvas = document.getElementById("canvas");
    const context = circle_canvas.getContext("2d");

    // Draw Image function
    const img = new Image();
    img.src = imageSrc;

    img.onload = function () {
        let imgRatio = img.naturalHeight / img.naturalWidth,
            height = width * imgRatio;
        circle_canvas.width = width;
        circle_canvas.height = width * imgRatio;
        context.drawImage(img, 0, 0, width, height);
        const logo = new Image();
        logo.onload = function () {
            let logoRatio = logo.naturalHeight / logo.naturalWidth,
                logoWidth = width/1.8,
                logoHeight = logoWidth * logoRatio;
            context.drawImage(logo, logoWidth/2.2, height/2.3, logoWidth, logoHeight);
        }
        logo.src = logoPath;
        textObjs.forEach(textObj => {
            context.save();
            context.lineWidth = 1;
            context.fillStyle = textObj.fillStyle;
            context.font = textObj.fontWeight +" "+ width / textObj.fontSize + "px 'goodVibrations'";
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            if (textObj.sideWays) {
                context.rotate(Math.PI / 2);
                context.fillText(textObj.text, (width*imgRatio + 70) / 2 , -((width/textObj.fontSize) + textObj.textHeight));
            } else {
                context.fillText(textObj.text, width / 2 , height / textObj.textHeight);
            }
            context.restore();
        })

    };
}

$(document).ready(function () {
    [...document.getElementsByClassName('mdc-text-field')].forEach(el => {
        mdc.textField.MDCTextField.attachTo(el);
    })
    $('#label-form').on('input', function () {
        addTextToImage(logoPath,
            [
            {...textObjs.title, text: $(this)[0][1].value},
            {...textObjs.year, text: $(this)[0][2].value},
            {...textObjs.volume, text: $(this)[0][3].value}
        ], $(this)[0][0].value * 3.779527559);
    });
    $('#download-canvas').click(function () {
        const canvas =  document.getElementById("canvas");
        const img = canvas.toDataURL('image/png')
        var a = $("<a>")
            .attr("href", img)
            .attr("download",  document.getElementById("label-field").value+".png")
            .appendTo("body");
        a[0].click();
        a.remove();
    })
    $('#update-canvas').click(function () {
        const canvas =  document.getElementById("canvas");
        const img = canvas.toDataURL('image/png')
        const demoImg = document.getElementById('demo');
        demoImg.src = img
        demoImg.width = canvas.width;
    })
    $('.label-selector').click(function () {
        logoPath = $(this)[0].value;
        $('#label-form').trigger('input');
    })

    $('#background-color').on('input', function () {
        $('.right-sidebar').css('background-color', $(this)[0].value);
    });

    addTextToImage('images/Viinamari.png',[textObjs.title, textObjs.year, textObjs.volume], 440);
})
