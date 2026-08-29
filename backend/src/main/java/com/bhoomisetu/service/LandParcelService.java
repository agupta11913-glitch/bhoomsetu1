package com.bhoomisetu.service;

import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.repository.LandParcelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LandParcelService {

    @Autowired
    private LandParcelRepository landParcelRepository;

    public List<LandParcel> getAllLandParcels() {
        return landParcelRepository.findAll();
    }

    public Optional<LandParcel> getByKhasraNumber(String khasraNumber) {
        return landParcelRepository.findByKhasraNumber(khasraNumber);
    }

    public Optional<LandParcel> getByCaseId(String caseId) {
        return landParcelRepository.findByCaseId(caseId);
    }

    public List<LandParcel> getByProjectId(String projectId) {
        return landParcelRepository.findByProjectId(projectId);
    }

    public List<LandParcel> getByDistrict(String district) {
        return landParcelRepository.findByDistrict(district);
    }

    public List<LandParcel> getByEmail(String email) {
        return landParcelRepository.findByEmail(email);
    }

    public LandParcel saveLandParcel(LandParcel parcel) {
        return landParcelRepository.save(parcel);
    }

    public LandParcel verifyRevenueRecord(String khasraNumber, String officerNotes) {
        Optional<LandParcel> opt = landParcelRepository.findByKhasraNumber(khasraNumber);
        if (opt.isPresent()) {
            LandParcel p = opt.get();
            p.setRevenueVerified(true);
            p.setRevenueOfficerNotes(officerNotes);
            if (p.getStatus() == null || p.getStatus().equals("IDENTIFIED")) {
                p.setStatus("VERIFIED");
            }
            return landParcelRepository.save(p);
        }
        return null;
    }

    public LandParcel verifyGISBoundary(String khasraNumber, String gisNotes) {
        Optional<LandParcel> opt = landParcelRepository.findByKhasraNumber(khasraNumber);
        if (opt.isPresent()) {
            LandParcel p = opt.get();
            p.setGisVerified(true);
            p.setGisStatus("VERIFIED");
            p.setGisOfficerNotes(gisNotes);
            return landParcelRepository.save(p);
        }
        return null;
    }
}
