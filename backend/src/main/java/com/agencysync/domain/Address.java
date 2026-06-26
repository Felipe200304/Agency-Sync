package com.agencysync.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

/**
 * Endereço reutilizável (objeto de valor). Embutido via {@code @Embedded} em
 * qualquer entity que precise de endereço — cliente, agência, modelo etc.
 * Os nomes das colunas batem com os já existentes (city/state), então mapeia
 * sem renomear nada no banco.
 */
@Embeddable
@Getter
@Setter
public class Address {

    private String cep;
    private String street;

    @Column(name = "number")
    private String number;

    private String complement;
    private String district;
    private String city;
    private String state;
}
