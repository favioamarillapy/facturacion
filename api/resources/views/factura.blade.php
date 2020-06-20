<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Factura Nº {{$factura->numero}}</title>

    <style>
        * {
            padding: 0;
            margin: 0;
            font-size: 10px;
        }

        body {
            padding: 20PX 50px 0px 50px;
        }
        
        .nro-factura {
            font-size: 18px;
            margin-top: 52px;
            margin-left: 435;
        }

        .cliente {
            font-size: 14px;
        }
    </style>
</head>

<body>
    
    <div class="original">
        {{-- numero de factura --}}
        <div style="width: 100%;">
            <p class="nro-factura">{{ explode('-', $factura->numero)[2] }}</p>
        </div>
        
        <div style="width: 100%; height: 8px;"></div>
        {{-- datos del cliente --}}
        <div style="width: 100%;">
            <div style="margin-left: 80px; margin-top: 15px">{{ \Carbon\Carbon::parse($factura->fecha_emision)->format('d/m/Y') }}</div>
            
            <div style="margin-left: 80px; margin-top: 5px">{{ $factura->cliente->ruc }}</div>
            <div style="margin-left: 180px; margin-top: 7px">{{ $factura->cliente->razon_social }}</div>
            <div style="margin-left: 95px; margin-top: 3px">{{ $factura->cliente->direccion }}</div>
        </div>

        <div style="width: 100%; height: 15px;"></div>

        {{-- lista de servicios --}}
        @php
            $total5 = 0;
            $total10 = 0;
            $totalIVA = 0;
        @endphp
        <div style="width:100%; height: 250px; margin-top: 10px;">
            @foreach ($detalles as $detalle)
                <div style="display: block; height: 15px; margin-top: 5px;">
                    <div style="display: inline-block; width: 37px; text-align: left; margin-left: 35px"> {{ $detalle->cantidad }}</div>
                    <div style="display: inline-block; width: 56px; text-align: center; color: white">0</div>
                    <div style="display: inline-block; width: 250px; margin-left: 10px">{{ $detalle->descripcion }}</div>
                    <div style="display: inline-block; width: 40px; text-align: center;">{{ number_format(intval($detalle->precio_unitario), 0, ",", ".") }}</div>
                    <div style="display: inline-block; width: 40px; text-align: center; margin-left: 30px">{{ number_format(intval($detalle->exento), 0, ",", ".") }}</div>
                    <div style="display: inline-block; width: 40px; text-align: center; margin-left: 30px">{{ number_format(intval($detalle->iva_5), 0, ",", ".") }}</div>
                    <div style="display: inline-block; width: 80px; text-align: right; margin-left: 20px;">{{ number_format(intval($detalle->iva_10), 0, ",", ".") }}</div>
                </div>
                @php
                    $total5 += $detalle->iva_5;
                    $total10 += $detalle->iva_10;
                @endphp
            @endforeach
        </div>
        
        {{-- totales --}}
        <div style="width: 100%;">
            <span style="margin-left: 80px;">{{ $factura->total }}</span> <br> <br>
        </div>
        <div style="width: 100%;">
            <span style="margin-left: 100px;">Gs. {{ $total_texto }}</span>
        </div>
        <div style="width: 100%; margin-top: 10px;">
            <span style="margin-left: 200px;">{{ number_format(($total5 / 11), 3, ",", ".") }}</span>
            <span style="margin-left: 140px">{{ number_format(($total10 / 11), 3, ",", ".") }}</span>
            <span style="margin-left: 140px">{{ number_format((($total5 / 11) + ($total10 / 11)), 3, ",", ".") }}</span>
        </div>
    </div>

</body>

</html>