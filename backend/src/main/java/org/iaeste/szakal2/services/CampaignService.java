package org.iaeste.szakal2.services;

import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.repositories.CampaignRepository;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
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

    public void truncate(){
        campaignRepository.deleteAll();
    }

    private Campaign campaignFromCreationDTO(CampaignCreationDTO campaignCreationDTO) {
        return Campaign.builder()
                .name(campaignCreationDTO.getName())
                .startDate(campaignCreationDTO.getStartDate())
                .build();
    }
}
