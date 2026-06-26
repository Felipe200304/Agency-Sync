package com.agencysync.web.dto;

import com.agencysync.domain.Address;

/** Espelha {@link Address} na API. Reutilizável em qualquer DTO com endereço. */
public record AddressDto(String cep, String street, String number,
                         String complement, String district, String city, String state) {

    public static AddressDto from(Address a) {
        if (a == null) return null;
        return new AddressDto(a.getCep(), a.getStreet(), a.getNumber(),
                a.getComplement(), a.getDistrict(), a.getCity(), a.getState());
    }

    /** Copia os campos para um endereço da entidade (cria um novo se nulo). */
    public Address applyTo(Address a) {
        Address target = a == null ? new Address() : a;
        target.setCep(cep);
        target.setStreet(street);
        target.setNumber(number);
        target.setComplement(complement);
        target.setDistrict(district);
        target.setCity(city);
        target.setState(state);
        return target;
    }
}
