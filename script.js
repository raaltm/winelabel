let logoPath = 'images/Viinamari.png';
const imageSrc = 'images/label.png';
const imgRatio = 1.3118527042577675;
const pixelsToMM = 3.779527559,
    widthMargin = 50,
    heightMargin = 40,
    paperWidth = (210 * pixelsToMM) - widthMargin,
    paperHeight = (297 * pixelsToMM) - heightMargin;
function addTextToImage(logoPath, textObjs, width, logoData = null) {
    const circle_canvas = document.getElementById("canvas");
    const context = circle_canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = function () {
        let height = width * imgRatio;
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
        if (logoData == null) {
            logo.src = logoPath;
        } else {
            logo.src = logoData;
        }
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

function printDiv(divName) {
    const originalContents = document.body.innerHTML,
        imgToPrint = document.getElementById('demo'),
        div = document.getElementById(divName);
    let horizontalAmount = Math.floor(paperWidth/imgToPrint.width);
    let verticalAmount = Math.floor(paperHeight/imgToPrint.height);
    for (let i = 0; i < horizontalAmount*verticalAmount; i++) {
        div.innerHTML = div.innerHTML + imgToPrint.outerHTML;
    }
    document.body.innerHTML = div.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
}
function itemsPerPage(width) {
    let horizontalAmount = Math.floor(paperWidth/(width * pixelsToMM));
    let verticalAmount = Math.floor(paperHeight/(width * imgRatio * pixelsToMM));
    return horizontalAmount * verticalAmount;
}
function maxWidthItemsPerPage(width) {
    let horizontalAmount = Math.floor(paperWidth/(width * pixelsToMM));
    return Math.floor((paperWidth / horizontalAmount) / pixelsToMM);
}
function updateCanvas() {
    const canvas =  document.getElementById("canvas");
    const img = canvas.toDataURL('image/png')
    const demoImg = document.getElementById('demo');
    demoImg.src = img
    demoImg.width = canvas.width;
    $('#label-form').trigger('input');
}
function initWineLabelGenerator() {
    const textObjs = {
        title: {
            text: document.getElementById('label-field').value,
            fontSize: 6,
            textHeight: 2.6,
            fillStyle: "#696969",
            fontWeight: '',
            sideWays: false
        },
        year: {
            text: document.getElementById('year-field').value,
            fontSize: 15,
            textHeight: 1.085,
            fillStyle: "#000000",
            fontWeight: 'bold',
            sideWays: false
        },
        volume:  {
            text: document.getElementById('volume-field').value,
            fontSize: 15,
            textHeight: 8,
            fillStyle: "#000000",
            fontWeight: 'bold',
            sideWays: true
        }
    };
    [...document.getElementsByClassName('mdc-text-field')].forEach(el => {
        mdc.textField.MDCTextField.attachTo(el);
    })
    $('#label-form').on('input', function () {
        var reader = new FileReader();
        const form = $(this),
            customLabel = $('#custom-label'),
            heightField = $('#height-field'),
            height = Math.round(form[0][0].value * imgRatio);
        $('#width-field').attr('value',form[0][0].value);
        heightField.val(height);
        heightField.attr('value', height)
        $('#label-field').attr('value',form[0][2].value);
        $('#year-field').attr('value',form[0][3].value);
        $('#volume-field').attr('value',form[0][4].value);
        $('#per-page').html(itemsPerPage(form[0][0].value));
        $('#per-page-width').html(maxWidthItemsPerPage(form[0][0].value));
        if ($(this)[0][5].files.length !== 0) {
            reader.readAsDataURL($(this)[0][5].files[0]);
            reader.onload = function (e) {
                addTextToImage(logoPath,
                    [
                        {...textObjs.title, text: form[0][2].value},
                        {...textObjs.year, text: form[0][3].value},
                        {...textObjs.volume, text: form[0][4].value}
                    ], form[0][0].value * pixelsToMM, e.target.result);
                customLabel.removeClass('hidden');
                customLabel.val(e.target.result);
                $('#custom-label-img').attr('src', e.target.result);
            }
        }
        addTextToImage(logoPath,
            [
                {...textObjs.title, text: form[0][2].value},
                {...textObjs.year, text: form[0][3].value},
                {...textObjs.volume, text: form[0][4].value}
            ], form[0][0].value * pixelsToMM, reader.result);
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
    $('#print-canvas').click(function () {
        updateCanvas();
        printDiv('print');
        initWineLabelGenerator();
    })
    $('#update-canvas').click(function () {
        updateCanvas();
    })
    $('.label-selector').click(function () {
        logoPath = $(this)[0].value;
        $('#file').val(null);
        $('#label-form').trigger('input');
    })

    $('#background-color').on('input', function () {
        $('.right-sidebar').css('background-color', $(this)[0].value);
        $('.label-selector').css('background-color', $(this)[0].value);
        $('.wine-button').css('background-color', $(this)[0].value);
    });
    addTextToImage(logoPath,[textObjs.title, textObjs.year, textObjs.volume], document.getElementById('width-field').value * pixelsToMM);
}
$(document).ready(function () {
    initWineLabelGenerator()
})
