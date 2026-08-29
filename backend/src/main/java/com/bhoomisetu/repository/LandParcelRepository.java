package com.bhoomisetu.repository;

import com.bhoomisetu.entity.LandParcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandParcelRepository extends JpaRepository<LandParcel, Long> {
    Optional<LandParcel> findByKhasraNumber(String khasraNumber);
    Optional<LandParcel> findByCaseId(String caseId);
    List<LandParcel> findByProjectId(String projectId);
    List<LandParcel> findByState(String state);
    List<LandParcel> findByDistrict(String district);
    List<LandParcel> findByStatus(String status);
    List<LandParcel> findByEmail(String email);
    List<LandParcel> findByAadhaarMasked(String aadhaarMasked);
}
