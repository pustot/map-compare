import * as React from "react";
import { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import { I18nText } from "../utils/I18n";
import { Typography } from "@mui/material";

// 定义城市位置的 TypeScript 接口
interface CityPosition {
    [key: string]: [number, number];
}

// 地图初始位置
const positions: CityPosition = {
    beijing: [39.9042, 116.4074],
    shanghai: [31.2304, 121.4737],
    guangzhou: [23.1291, 113.2644],
    shenzhen: [22.5429, 114.0596],
};

// 自定义钩子，用于设置地图的视图
const SetView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

// MapComponent 接受一个中心位置和缩放级别，类型分别为 [number, number] 和 number
const MapComponent: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
            <SetView center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
};

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [zoom, setZoom] = useState(10); // 默认缩放级别
    const [scale, setScale] = useState(Math.pow(10, 5) / 10000); // 根据 zoom 计算的比例尺
  
    return (
      <div>
        <Typography variant="h6">当前缩放级别: {scale.toFixed(0)}</Typography>
        <Slider
          min={0}
          max={10}
          defaultValue={5}
          step={0.01}
          onChange={(event, newValue) => {
            const newScale = Math.pow(10, newValue as number) / 10000;
            setZoom(newScale);
            setScale(newScale);
          }}
          aria-labelledby="zoom-slider"
        />
        <Grid container spacing={4}>
          {Object.entries(positions).map(([city, position]: [string, [number, number]]) => (
            <Grid item xs={6} key={city}>
              <MapComponent center={position} zoom={zoom} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
};
