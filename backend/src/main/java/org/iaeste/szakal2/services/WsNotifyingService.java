package org.iaeste.szakal2.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WsNotifyingService {

    private static final String UPDATE_MESSAGE = "UPDATE";
    private static final String COMPANIES_TOPIC = "/companies";
    private static final String JOURNEYS_TOPIC = "/journeys";
    private static final String COMPANY_TOPIC = "/company";
    private static final String JOURNEY_TOPIC = "/journey";
    private static final String SUMMARY_TOPIC = "/summary";
    private final SimpMessagingTemplate simpMessagingTemplate;

    public WsNotifyingService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void sendUpdateToTopic(String topic) {
        simpMessagingTemplate.convertAndSend("/topic" + topic, UPDATE_MESSAGE);
    }

    public void sendUpdateAboutCompanies() {
        sendUpdateToTopic(COMPANIES_TOPIC);
    }

    public void sendUpdateAboutJourneys(UUID campaignId) {
        sendUpdateToTopic(STR."\{JOURNEYS_TOPIC}/\{campaignId}");
    }

    public void sendUpdateAboutCompany(UUID id) {
        sendUpdateToTopic(STR."\{COMPANY_TOPIC}/\{id}");
    }

    public void sendUpdateAboutJourney(UUID id) {
        sendUpdateToTopic(STR."\{JOURNEY_TOPIC}/\{id}");
    }

    public void sendUpdateAboutSummary(UUID campaignId) {
        sendUpdateToTopic(STR."\{SUMMARY_TOPIC}/\{campaignId}");

    }
}
