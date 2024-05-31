package com.billing.model;

import com.billing.enums.ReportTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportFilters {
    private String paymentMode;
    private Long supplierId;
    private String metalType;
    private String purchaseType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal minPurchaseAmount;
    private BigDecimal maxPurchaseAmount;
    private BigDecimal minBalAmount;
    private BigDecimal maxBalAmount;
    private ReportTypeEnum reportType;
}
