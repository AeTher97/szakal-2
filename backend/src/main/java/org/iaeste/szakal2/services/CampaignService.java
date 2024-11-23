package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.dto.campaign.CampaignHomeDTO;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyListingDTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.UserGroup;
import org.iaeste.szakal2.repositories.CampaignRepository;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.repositories.JourneySpecification;
import org.iaeste.szakal2.repositories.UserGroupRepository;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ContactJourneyRepository contactJourneyRepository;
    private final UserGroupRepository userGroupRepository;

    public CampaignService(CampaignRepository campaignRepository,
                           ContactJourneyRepository contactJourneyRepository,
                           UserGroupRepository userGroupRepository) {
        this.campaignRepository = campaignRepository;
        this.contactJourneyRepository = contactJourneyRepository;
        this.userGroupRepository = userGroupRepository;
    }

    @Transactional
    public Campaign createCampaign(CampaignCreationDTO campaignCreationDTO) {
        Campaign campaign = campaignRepository.save(campaignFromCreationDTO(campaignCreationDTO));
        if (campaignCreationDTO.getUserGroupId() != null) {
            addCampaignToGroup(campaignCreationDTO.getUserGroupId(), campaign);
        }
        return campaign;
    }

    public Campaign modifyCampaign(UUID id, CampaignCreationDTO campaignCreationDTO) {
        Campaign campaign = getCampaignById(id);
        BeanUtils.copyProperties(campaignCreationDTO, campaign, Utils.getNullPropertyNames(campaignCreationDTO));
        return campaignRepository.save(campaign);
    }

    public CampaignHomeDTO getCampaignHomeDTOById(UUID id) {
        Campaign campaign = getCampaignById(id);
        int count = contactJourneyRepository.countAllByCampaign(campaign);
        return CampaignHomeDTO.fromCampaign(campaign, count);
    }

    public Campaign getCampaignById(UUID id) {
        Optional<Campaign> campaignOptional = campaignRepository.findCampaignById(id);
        if (campaignOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    Campaign with id \{id} does not exist""");
        }
        return campaignOptional.get();
    }

    public Page<Campaign> getCampaigns(Pageable pageable) {
        return campaignRepository.findAllByOrderByNameDesc(pageable);
    }

    public List<Campaign> getCampaigns(List<UUID> userList) {
        return campaignRepository.findAllById(userList);
    }

    public Page<ContactJourneyListingDTO> getJourneysForCampaign(Pageable pageable, ContactJourneySearch contactJourneySearch) {
        return getJourneysForCampaign(pageable, new JourneySpecification(contactJourneySearch));
    }

    private Page<ContactJourneyListingDTO> getJourneysForCampaign(Pageable pageable, Specification<ContactJourney> specification) {
        Page<ContactJourney> contactJourneyPage = contactJourneyRepository.findAll(specification, pageable);
        List<ContactJourney> contactJourneys = contactJourneyRepository
                .findAllById(contactJourneyPage.map(ContactJourney::getId).stream().toList());

        return new PageImpl<>(contactJourneys.stream()
                .map(ContactJourneyListingDTO::fromContactJourney)
                .toList(), pageable, contactJourneyPage.getTotalElements());

    }

    private Campaign campaignFromCreationDTO(CampaignCreationDTO campaignCreationDTO) {
        return Campaign.builder()
                .name(campaignCreationDTO.getName())
                .startDate(campaignCreationDTO.getStartDate())
                .description(campaignCreationDTO.getDescription())
                .build();
    }

    private void addCampaignToGroup(UUID userGroupId, Campaign campaign) {
        UserGroup userGroup = getUserGroup(userGroupId);
        userGroup.getCampaignList().add(campaign);
        userGroupRepository.save(userGroup);
    }

    private UserGroup getUserGroup(UUID id) {
        return userGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(STR."User group with id \{id} not found"));
    }

}
