package com.agencysync.domain;

/**
 * Papel de uma agência no vínculo com o modelo.
 * BASE = agência principal onde o modelo reside (fonte de verdade da agenda).
 * MOTHER = agência-mãe que posiciona o modelo em outras (comissão configurável).
 * INTERNATIONAL = agência fora do país; consulta a BASE antes de bookar.
 * LOCAL = representação local adicional.
 */
public enum AgencyRole { BASE, MOTHER, INTERNATIONAL, LOCAL }
