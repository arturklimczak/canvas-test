import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.scss']
})
export class CanvasEditorComponent implements OnInit {
  canvas: any;
  initSVG: any;
  imagesList: any[] = [];
  textList: any[] = [];
  selectedText: any;
  backgroundName = '';
  backgroundColor = '#FFFFFF';
  fontIcons: any[] = [
    {
      parameter: 'fontWeight',
      icon: 'format_bold',
      activeValue: 'bold',
      inactiveValue: 'normal'
    },
    {
      parameter: 'fontStyle',
      icon: 'format_italic',
      activeValue: 'italic',
      inactiveValue: 'normal'
    },
    {
      parameter: 'underline',
      icon: 'format_underline',
      activeValue: true,
      inactiveValue: false
    },
    {
      parameter: 'linethrough',
      icon: 'format_strikethrough',
      activeValue: true,
      inactiveValue: false
    },
  ];

  fontIconsList: string[] = [];

  @ViewChild('file') file: ElementRef | undefined;
  @ViewChild('fileBackground') fileBackground: ElementRef | undefined;

  constructor() { }

  ngOnInit(): void {
    this.fontIconsList = this.fontIcons.map(fontIcon => fontIcon.parameter);
    this.canvas = new fabric.Canvas('canvas');

    const priceText = new fabric.IText('2', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 200,
      top: 20,
      left: 10,
      fill: '#F01F32'
    });

    const priceText2 = new fabric.IText('99', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 110,
      top: 30,
      left: 130,
      fill: '#F01F32'
    });

    const priceText3 = new fabric.IText('2', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 50,
      top: 140,
      left: 140,
      fill: '#c3bfbf'
    });

    const priceText4 = new fabric.IText('99', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 20,
      top: 145,
      left: 170,
      fill: '#c3bfbf'
    });

    const text1 = new fabric.IText('Namysłów PILS', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      underline: false,
      fontSize: 70,
      top: 250,
      left: 10
    });

    const text2 = new fabric.IText('piwo butelkowe 0,5l', {
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fill: '#c3bfbf',
      fontSize: 35,
      top: 320,
      left: 10
    });

    this.textList.push(text1, text2);

    this.canvas.add(priceText, priceText2, priceText3, priceText4, text1, text2);
    text1.bringToFront();

    this.initSVG = this.canvas.toSVG();
    // console.log(this.initSVG);

    this.canvas.on('selection:created', () => {
      this.selectText();
    });

    this.canvas.on('selection:updated', () => {
      this.selectText();
    });

    this.canvas.on('selection:cleared', () => {
      this.selectText();
    });
  }

  selectText(): void {
    const obj = this.canvas.getActiveObject();

    if (obj?.type === 'i-text') {
      // console.log(obj);
      // console.log(this.textList);
      // console.log(obj === this.textList[0]);
      this.selectedText = obj;
    } else {
      this.selectedText = null;
    }
  }

  exportSVG(): void {
    const svg = this.canvas.toSVG();
    console.log(svg);
    // console.log('takie samo jak init?: ', svg === this.initSVG);
  }

  selectBackground(): void {
    this.fileBackground?.nativeElement.click();
  }

  selectImage(): void {
    this.file?.nativeElement.click();
  }

  uploadImage(event: any, background: boolean = false): void {
    Array.prototype.forEach.call(event?.target?.files, (file) => {
      const imageReader = new FileReader();
      imageReader.readAsDataURL(file);
      imageReader.onload = () => {
        if (typeof imageReader.result === 'string') {
          if (background) {
            this.setBackgroundImage(imageReader.result, file);
          } else {
            this.addImage(imageReader.result, file);
          }
        }
      };
    });
  }

  addImage(data: string, file: any): void {
    fabric.Image.fromURL(data, (img) => {
      const widthToScale = 600 / (img.width || 600);
      const heightToScale = 400 / (img.height || 400);
      let scale = Math.min(widthToScale, heightToScale);
      if (scale > 1) {
        scale = 1;
      }

      img.set('left', 0);
      img.set('top', 0);
      img.scale(scale);
      this.canvas.add(img);

      this.imagesList.push({
        id: new Date().getTime() + Number((Math.random() * 100).toFixed(0)),
        name: file.name,
        base64: data,
        element: img
      });
    });
  }

  setBackgroundImage(data: string, file: any): void {
    console.log('??', data);
    this.backgroundName = file.name;
    this.canvas.setBackgroundImage(data, this.canvas.renderAll.bind(this.canvas));
  }

  removeImage(image: any): void {
    this.canvas.remove(image.element);
    this.imagesList = this.imagesList.filter(img => img.id !== image.id);
  }

  updateText(event: any, parameter: string): void {
    const value = ['string', 'boolean'].includes(typeof(event)) ? event : event?.target?.value;

    if (this.fontIconsList.includes(parameter)) {
      // bug zwiazany z nieodswiezaniem w canvasie wielkosci czcionki underline itp.
      this.selectedText.set(parameter, value);
      const color = this.selectedText.get('fill');
      this.selectedText.set('fill', color === '#c3bfbf' ? '#c3bfbd' : '#c3bfbf');
      this.selectedText.set('fill', color);
    } else {
      this.selectedText.set(parameter, value);
    }

    this.canvas.renderAll();
  }

  resetBackground(): void {
    this.backgroundName = '';
    this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
  }

  setBackgroundColor(event: any): void {
    const value = event.target.value;
    this.canvas.setBackgroundColor(value, this.canvas.renderAll.bind(this.canvas));
  }

  resetBackgroundColor(): void {
    this.backgroundColor = '#FFFFFF';
    this.canvas.setBackgroundColor('#ffffff', this.canvas.renderAll.bind(this.canvas));
  }
}
