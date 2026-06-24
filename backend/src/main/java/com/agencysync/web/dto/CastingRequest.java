package com.agencysync.web.dto;

import com.agencysync.domain.Brand;
import com.agencysync.domain.Casting;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CastingRequest(
        UUID brandId, @NotBlank String title,
        String responsible, String email, String phone,
        String location, String city, String state,
        LocalDate date, String time, Integer modelsNeeded, String desiredProfile,
        BigDecimal cachet, String paymentDeadline, String campaignDuration, String workDuration,
        String description) {

    public Casting applyTo(Casting c, Brand brand) {
        c.setBrand(brand);
        c.setTitle(title);
        c.setResponsible(responsible);
        c.setEmail(email);
        c.setPhone(phone);
        c.setLocation(location);
        c.setCity(city);
        c.setState(state);
        c.setEventDate(date);
        c.setEventTime(time);
        c.setModelsNeeded(modelsNeeded == null ? 1 : modelsNeeded);
        c.setDesiredProfile(desiredProfile);
        c.setCachet(cachet);
        c.setPaymentDeadline(paymentDeadline);
        c.setCampaignDuration(campaignDuration);
        c.setWorkDuration(workDuration);
        c.setDescription(description);
        return c;
    }
}
