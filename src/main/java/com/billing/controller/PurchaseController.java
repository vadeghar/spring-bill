package com.billing.controller;

import com.billing.constant.Metal;
import com.billing.dto.ErrorResponse;
import com.billing.entity.Estimation;
import com.billing.entity.Purchase;
import com.billing.service.MetalRateService;
import com.billing.service.PurchaseService;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/purchase")
public class PurchaseController {
    private final PurchaseService purchaseService;
    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public String get(@RequestHeader HttpHeaders httpHeaders, @Valid @ModelAttribute("purchase") Purchase purchase,
                      BindingResult result,
                      Model model) {
        if (httpHeaders.containsKey("X-Application-Name")) {
            System.out.println("Found X-Application-Name in header");
        }
        List<Purchase> purchaseList = purchaseService.getAll();
        model.addAttribute("purchaseList", purchaseList);
        model.addAttribute("purchase", new Purchase());
        return "purchase";
    }

    @PostMapping
    public String edit(@RequestHeader HttpHeaders httpHeaders, @Valid @ModelAttribute("purchase") Purchase purchase,
                      BindingResult result,
                      Model model) {
        if (httpHeaders.containsKey("X-Application-Name")) {
            System.out.println("Found X-Application-Name in header");
        }
        if (purchase.getId() == null) {
            throw new RuntimeException("purchase id missing.");
        }
        List<Purchase> purchaseList = purchaseService.getAll();
        model.addAttribute("purchaseList", purchaseList);
        model.addAttribute("purchase", purchaseService.getById(purchase.getId()));
        return "purchase";
    }

    @PostMapping("/save")
    public String registration(@RequestHeader HttpHeaders httpHeaders, @Valid @ModelAttribute("purchase") Purchase purchase,
                               BindingResult result,
                               Model model) {
        if (httpHeaders.containsKey("X-Application-Name")) {
            System.out.println("Found X-Application-Name in header");
        }
        ErrorResponse errorResponse = purchaseService.validatePurchase(purchase);
        model.addAttribute("purchaseList", purchaseService.getAll());
        if(errorResponse.hasErrors()) {
            model.addAttribute("purchase", purchase);
            model.addAttribute("errorResponse", errorResponse);
            return "item";
        }
        model.addAttribute("purchase", purchaseService.save(purchase));
        return "redirect:/purchase?success";
    }
}
