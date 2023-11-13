package org.iaeste.szakal2.services;

import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.repositories.CampaignRepository;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ContactJourneyRepository contactJourneyRepository;

    public CampaignService(CampaignRepository campaignRepository, ContactJourneyRepository contactJourneyRepository) {
        this.campaignRepository = campaignRepository;
        this.contactJourneyRepository = contactJourneyRepository;
    }

    public Campaign createCampaign(CampaignCreationDTO campaignCreationDTO) {
        return campaignRepository.save(campaignFromCreationDTO(campaignCreationDTO));
    }

    public Campaign modifyCampaign(UUID id, CampaignCreationDTO campaignCreationDTO) {
        Campaign campaign = getCampaignById(id);
        BeanUtils.copyProperties(campaignCreationDTO, campaign, Utils.getNullPropertyNames(campaignCreationDTO));
        return campaignRepository.save(campaign);
    }

    public Campaign getCampaignById(UUID id) {
        Optional<Campaign> campaignOptional = campaignRepository.findCampaignById(id);
        if (campaignOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR. """
                    Campaign with id \{ id } does not exist""" );
        }
        return campaignOptional.get();
    }

    public Page<Campaign> getCampaigns(Pageable pageable) {
        return campaignRepository.findAllByOrderByNameDesc(pageable);
    }

    public Page<ContactJourney> getJourneysForCampaign(UUID id, Pageable pageable) {
        Campaign campaign = getCampaignById(id);
        return getJourneysByCampaign(campaign, pageable);
    }

    public void truncate() {
        campaignRepository.deleteAll();
    }

    private Page<ContactJourney> getJourneysByCampaign(Campaign campaign, Pageable pageable) {
        return contactJourneyRepository.findAllByCampaign(campaign, pageable);
    }

    private Campaign campaignFromCreationDTO(CampaignCreationDTO campaignCreationDTO) {
        return Campaign.builder()
                .name(campaignCreationDTO.getName())
                .startDate(campaignCreationDTO.getStartDate())
                .build();
    }
}
