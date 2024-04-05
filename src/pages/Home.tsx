import * as React from "react";
import { useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import { I18nText, getLocaleText } from "../utils/I18n";
import { Container, Typography } from "@mui/material";

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
    heze: [35.243, 115.4413],
    kunming: [25.0438, 102.7056], // Wuhua District
    edinburgh: [55.9533, -3.1883],
    seattle: [47.6062, -122.3321],
};

// 自定义钩子，用于设置地图的视图
const SetView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

interface MapComponentProps {
    center: [number, number];
    zoom: number;
    onZoomChange: (newZoom: number) => void;
}

interface ZoomHandlerProps {
    onZoomChange: (newZoom: number) => void;
}

const ZoomHandler: React.FC<ZoomHandlerProps> = ({ onZoomChange }) => {
    useMapEvents({
        zoomend: (e: { target: { getZoom: () => number; }; }) => {
            onZoomChange(e.target.getZoom());
        },
    });
    return null;
};

const MapZoomEffect: React.FC<{ zoom: number }> = ({ zoom }) => {
    const map = useMap();

    React.useEffect(() => {
        map.setZoom(zoom);
    }, [zoom, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, onZoomChange }) => {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '300px', width: '100%' }}>
            <ZoomHandler onZoomChange={onZoomChange} />
            <MapZoomEffect zoom={zoom} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
    );
};


export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [zoom, setZoom] = useState<number>(10);

    // 更新所有地图的缩放级别
    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "MapCompare",
                        "zh-Hant": "比圖",
                        "zh-Hans": "比图",
                        "tto-bro": "比图 MapCompare",
                        "tto": "比图 MapCompare",
                        "ja": "比图 MapCompare",
                        "de": "比图 MapCompare",
                    },
                    lang
                )}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {getLocaleText(
                    {
                        "en": "Compare maps in the same scale.",
                        "zh-Hant": "以同一比例尺比較數個地圖。",
                        "zh-Hans": "以同一比例尺比较数个地图。",
                    },
                    lang
                )}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1">当前缩放级别: {zoom.toFixed(1)}</Typography>
                <Slider
                    min={0}
                    max={20}
                    value={zoom}
                    step={0.1}
                    onChange={(event, newValue) => setZoom(newValue as number)}
                    aria-labelledby="zoom-slider"
                    style={{ marginLeft: '10px', width: '200px' }}
                />
            </div>
            <Grid container spacing={4}>
                {Object.entries(positions).map(([city, position]: [string, [number, number]]) => (
                    <Grid item xs={12} sm={6} key={city}>
                        <MapComponent center={position} zoom={zoom} onZoomChange={handleZoomChange} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
