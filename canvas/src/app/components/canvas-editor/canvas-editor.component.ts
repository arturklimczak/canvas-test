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
  @ViewChild('file') file: ElementRef | undefined;

  constructor() { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');

    const priceText = new fabric.IText('2', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 200,
      top: 20,
      left: 10,
      fill: 'red'
    });

    const priceText2 = new fabric.IText('99', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontSize: 110,
      top: 30,
      left: 130,
      fill: 'red'
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

    const text1 = new fabric.IText('Żywiec Saison', {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
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

  selectImage(): void {
    // console.log(this.file);
    // console.log(this.file?.nativeElement);
    this.file?.nativeElement.click();
  }

  uploadImage(event: any): void {
    Array.prototype.forEach.call(event?.target?.files, (file) => {
      // console.log(file);

      const imageReader = new FileReader();
      imageReader.readAsDataURL(file);
      imageReader.onload = () => {
        if (typeof imageReader.result === 'string') {
          fabric.Image.fromURL(imageReader.result, (img) => {
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
              base64: imageReader.result,
              element: img
            });
          });
        }

        // console.log(imageReader.result);
      };
    });
  }

  removeImage(image: any): void {
    this.canvas.remove(image.element);
    this.imagesList = this.imagesList.filter(img => img.id !== image.id);
  }

  updateText(event: any, parameter: string): void {
    // console.log(parameter);
    // console.log(event?.target?.value);
    // console.log(this.selectedText.get(parameter));
    this.selectedText.set(parameter, event?.target?.value);
    // console.log(this.selectedText.get(parameter));
    this.canvas.renderAll();
  }
}
