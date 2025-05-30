package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.dto.campaign.CampaignHomeDTO;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyListingDTO;
import org.iaeste.szakal2.models.dto.journey.Top10DTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.UserGroup;
import org.iaeste.szakal2.repositories.CampaignRepository;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.repositories.JourneySpecification;
import org.iaeste.szakal2.repositories.UserGroupRepository;
import org.iaeste.szakal2.utils.MapUtils;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;

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
        long count = contactJourneyRepository.count(new JourneySpecification(ContactJourneySearch.builder()
                .campaignId(id)
                .build()));
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

    public Top10DTO getTop10(UUID campaignId) {
        Campaign campaign = getCampaignById(campaignId);
        Map<String, Integer> top10 = new LinkedHashMap<>();

        List<ContactJourney> journeys = contactJourneyRepository.findAllByCampaign(campaign);
        journeys.forEach(journey -> {
            if (journey.getUser() == null || journey.getCompany().isDeleted()) {
                return;
            }
            top10.computeIfAbsent(journey.getUser().getFullName(), _ -> 0);
            top10.computeIfPresent(journey.getUser().getFullName(), (_, count) -> count + 1);
        });

        Map<String, Integer> sortedTop10 = MapUtils.sortByValue(top10);

        Top10DTO top10DTO = new Top10DTO();
        for (int i = 0; i < 10; i++) {
            if (i >= top10.size()) {
                continue;
            }
            String fullName = sortedTop10.keySet().stream().toList().get(i);
            int count = sortedTop10.get(fullName);
            top10DTO.addUser(fullName, count);
        }

        return top10DTO;
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
