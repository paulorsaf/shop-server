import { Injectable } from "@nestjs/common";
import { consultarCep } from "correios-brasil/dist";
import { Address } from "../model/address.model";
import fetch from 'node-fetch';

@Injectable()
export class AddressRepository {

    findByZipCode(zipCode: string): Promise<Address> {
        return consultarCep(zipCode).then(response => {
            return {
                city: response.localidade,
                complement: response.complemento,
                neighborhood: response.bairro,
                state: response.uf,
                street: response.logradouro,
                zipCode: response.cep
            }
        });
    }

    findGeolocationByZipCode(zipCode: string) {
        const baseUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
        const country = "BR";
        const key = process.env.GOOGLE_API_KEY;
        return fetch(`${baseUrl}?query=${zipCode.replace(/[^\d]/g, '')},${country}&key=${key}`)
            .then(r => r.json())
            .then((r: GooglePlaceResult) => {
                if (r.status === "OK") {
                    return {
                        latitude: r.results[0].geometry.location.lat,
                        longitude: r.results[0].geometry.location.lng
                    }
                }
                return null;
            })
    }

}

type GooglePlaceResult = {
    results: GooglePlaceResultLocation[],
    status: string
}

type GooglePlaceResultLocation = {
    geometry: {
        location: {
            lat: number,
            lng: number
        }
    }
}