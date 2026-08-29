package com.bhoomisetu.service;

import com.bhoomisetu.entity.Objection;
import com.bhoomisetu.repository.ObjectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ObjectionService {

    @Autowired
    private ObjectionRepository objectionRepository;

    public List<Objection> getAllObjections() {
        return objectionRepository.findAll();
    }

    public Optional<Objection> getByObjectionId(String objectionId) {
        return objectionRepository.findByObjectionId(objectionId);
    }

    public List<Objection> getByKhasraNumber(String khasraNumber) {
        return objectionRepository.findByKhasraNumber(khasraNumber);
    }

    public List<Objection> getByProjectId(String projectId) {
        return objectionRepository.findByProjectId(projectId);
    }

    public List<Objection> getByClaimantEmail(String claimantEmail) {
        return objectionRepository.findByClaimantEmail(claimantEmail);
    }

    public Objection saveObjection(Objection objection) {
        return objectionRepository.save(objection);
    }
}
