package com.jonathan.portfolio.project.dto;
import java.util.List;
public record DashboardResponse(long published,long drafts,long archived,long withoutCover,long incomplete,List<ProjectResponse> recent) {}
