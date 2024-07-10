import 'ol/ol.css'
import * as control from 'ol/control'
import { Feature, Map, View, Overlay } from 'ol'
import TileLayer from 'ol/layer/Tile'
import FullScreen from 'ol/control/FullScreen'
import XYZ from 'ol/source/XYZ'
import { Control } from 'ol/control'
import { Point } from 'ol/geom'
import { fromLonLat, transformExtent } from 'ol/proj'
import { defaults as defaultInteractions, DragPan } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Circle as CircleStyle, Style, Icon } from 'ol/style';

const defaultZoom = 14
const defaultCenter = [115.8252, 39.673]
const defaultRotation = 0
const defaultExtent = transformExtent([115.79, 39.66, 115.84, 39.685], 'EPSG:4326', 'EPSG:3857')

class RotateNorthControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {}
    const button = document.createElement('button')
    button.innerHTML = '↻'
    const element = document.createElement('div')
    element.className = 'rotate-north ol-unselectable ol-control'
    element.appendChild(button)
    super({ element: element, target: options.target })
    button.addEventListener('click', this.handleRotateNorth.bind(this), false)
  }
  handleRotateNorth() {
    const map = this.getMap()
    if (map) {
      const view = map.getView()
      view.setRotation(defaultRotation)
      view.setCenter(fromLonLat(defaultCenter))
      view.setZoom(defaultZoom)
    }
  }
}

function initMap() {
  const map = new Map({
    target: 'ShangFang-Mountain',
    controls: control.defaults({ attribution: true, zoom: true, rotate: true }).extend([new FullScreen()]),
    view: new View({
      extent: defaultExtent,
      center: fromLonLat(defaultCenter),
      maxZoom: 18,
      zoom: defaultZoom,
      minZoom: 12,
      rotation: defaultRotation,
      projection: 'EPSG:3857'
    }),
    interactions: defaultInteractions().extend([
      new DragPan({ condition: function () { return false; } })
    ])
  })

  const xyzLayer = new TileLayer({
    source: new XYZ({
      url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9c7ec345f02059c7ef160e017d59c010'
    })
  })
  map.addLayer(xyzLayer)

  const overviewMap = new control.OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap',
    collapsed: false,
    collapseLabel: '\u00BB',
    label: '\u00AB',
    rotateWithView: false,
    tipLabel: 'Overview map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9c7ec345f02059c7ef160e017d59c010'
        })
      })
    ]
  })
  map.addControl(overviewMap)

  const pointsData = [
    {
      coordinates: [115.816, 39.664],
      info: {
        title: "北京上方山国家森林公园",
        titleURL: "https://baike.baidu.com/item/%E5%8C%97%E4%BA%AC%E4%B8%8A%E6%96%B9%E5%B1%B1%E5%9B%BD%E5%AE%B6%E6%A3%AE%E6%9E%97%E5%85%AC%E5%9B%AD/2329569",
        text: "北京上方山国家森林公园位于北京市房山区韩村河镇，是一座集自然、佛教和溶洞为一体的综合性国家森林公园。",
        imgURL: require("@/assets/东门.png"),
        iconURL: require("@/assets/东门.png"),
        iconScale: 0.08,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8208, 39.6695],
      info: {
        title: "发汗岭",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/发汗岭.jpg"),
        iconURL: require("@/assets/发汗岭.jpg"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '400px'
      }
    },
    {
      coordinates: [115.8224, 39.6758],
      info: {
        title: "兜率寺",
        titleURL: "",
        text: "兜率寺是一座著名的佛教寺庙，历史悠久。",
        imgURL: require("@/assets/兜率寺.jpg"),
        iconURL: require("@/assets/兜率寺.jpg"),
        iconScale: 0.08,
        imgWidth: '350px',
        imgHeight: '200px'
      }
    },
    {
      coordinates: [115.819, 39.676],
      info: {
        title: "槐树王",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/槐树王.jpg"),
        iconURL: require("@/assets/槐树王.jpg"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '400px'
      }
    },
    {
      coordinates: [115.824, 39.6706],
      info: {
        title: "钟楼",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/钟楼.png"),
        iconURL: require("@/assets/钟楼.png"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.813, 39.672],
      info: {
        title: "骆驼峰",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/骆驼峰.jpg"),
        iconURL: require("@/assets/骆驼峰.jpg"),
        iconScale: 0.08,
        imgWidth: '300px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8231, 39.677],
      info: {
        title: "藏经阁",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/藏经阁.png"),
        iconURL: require("@/assets/藏经阁.png"),
        iconScale: 0.08,
        imgWidth: '350px',
        imgHeight: '200px'
      }
    },
    {
      coordinates: [115.8206, 39.67611],
      info: {
        title: "文殊殿",
        titleURL: "",
        text: "文殊殿是一座佛教寺庙，供奉文殊菩萨。",
        imgURL: require("@/assets/文殊殿.jpg"),
        iconURL: require("@/assets/文殊殿.jpg"),
        iconScale: 0.06,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8103, 39.6739],
      info: {
        title: "云水洞",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/云水洞.png"),
        iconURL: require("@/assets/云水洞.png"),
        iconScale: 0.06,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    },
    {
      coordinates: [115.8182, 39.67776],
      info: {
        title: "柏树王",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/柏树王.jpg"),
        iconURL: require("@/assets/柏树王.jpg"),
        iconScale: 0.06,
        imgWidth: '300px',
        imgHeight: '400px'
      }
    },
    {
      coordinates: [115.8210, 39.671],
      info: {
        title: "云梯",
        titleURL: "",
        text: "",
        imgURL: require("@/assets/云梯.png"),
        iconURL: require("@/assets/云梯.png"),
        iconScale: 0.1,
        imgWidth: '300px',
        imgHeight: '350px'
      }
    },
    {
      coordinates: [115.8214, 39.67472],
      info: {
        title: "塔院",
        titleURL: "",
        text: "塔院是一片古老的佛塔群，充满历史气息。",
        imgURL: require("@/assets/塔院.jpg"),
        iconURL: require("@/assets/塔院.jpg"),
        iconScale: 0.08,
        imgWidth: '250px',
        imgHeight: '320px'
      }
    },
    {
      coordinates: [115.8208, 39.6728],
      info: {
        title: "华严洞",
        titleURL: "",
        text: "华严洞是一处天然溶洞，景色壮观。",
        imgURL: require("@/assets/华严洞.jpg"),
        iconURL: require("@/assets/华严洞.jpg"),
        iconScale: 0.008,
        imgWidth: '350px',
        imgHeight: '250px'
      }
    }
  ];

  function createCircularImage(url, diameter) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
  
    canvas.width = diameter;
    canvas.height = diameter;
  
    return new Promise((resolve) => {
      image.onload = () => {
        context.beginPath();
        context.arc(diameter / 2, diameter / 2, diameter / 2, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(image, 0, 0, diameter, diameter);
        resolve(canvas.toDataURL());
      };
      image.src = url;
    });
  }

  async function createFeatureStyle(iconURL) {
    const circularImageURL = await createCircularImage(iconURL, 50);
    return new Style({
      image: new Icon({
        src: circularImageURL,
        scale: 1,
      })
    });
  }

  const featurePromises = pointsData.map(async (pointData) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat(pointData.coordinates)),
      info: pointData.info,
    });
    const style = await createFeatureStyle(pointData.info.iconURL);
    feature.setStyle(style);
    return feature;
  });

  Promise.all(featurePromises).then((features) => {
    const featureLayer = new VectorLayer({
      source: new VectorSource({
        features: features
      }),
      visible: true
    });
    map.addLayer(featureLayer);
    setupPopup(map);
  });

  return map;
}

function setupPopup(map) {
  const container = document.getElementById('popup')
  const content = document.getElementById('popup-content')
  const closer = document.getElementById('popup-closer')

  const popup = new Overlay({
    element: container,
    autoPan: true,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPanAnimation: { duration: 250 }
  })
  map.addOverlay(popup)

  if (closer) {
    closer.onclick = function () {
      popup.setPosition(undefined);
      closer.blur();
      return false
    }
  }

  map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    })
    if (feature) {
      content.innerHTML = '';
      const info = feature.get('info');
      if (info) {
        addFeatureInfo(info);
        popup.setPosition(feature.getGeometry().getCoordinates());
      }
    }
  });

  map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  function addFeatureInfo(info) {
    const elementA = document.createElement('a');
    elementA.className = "markerInfo";
    elementA.href = info.titleURL;
    setInnerText(elementA, info.title);
    content.appendChild(elementA);
    
    const elementDiv = document.createElement('div');
    elementDiv.className = "markerText";
    setInnerText(elementDiv, info.text);
    content.appendChild(elementDiv);
    
    const elementImg = document.createElement('img');
    elementImg.src = info.imgURL;
    elementImg.style.width = info.imgWidth;
    elementImg.style.height = info.imgHeight;
    content.appendChild(elementImg);
  }

  function setInnerText(element, text) {
    if (typeof element.textContent === "string") {
      element.textContent = text;
    } else {
      element.innerText = text;
    }
  }
}
export { initMap, RotateNorthControl, setupPopup }