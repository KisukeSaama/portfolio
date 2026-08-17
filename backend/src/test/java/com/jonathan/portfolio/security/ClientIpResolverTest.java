package com.jonathan.portfolio.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class ClientIpResolverTest {
    private static MockHttpServletRequest request(String remoteAddr, String forwardedFor) {
        var request = new MockHttpServletRequest();
        request.setRemoteAddr(remoteAddr);
        if (forwardedFor != null) request.addHeader("X-Forwarded-For", forwardedFor);
        return request;
    }

    @Test void readsTheEntryOurOwnProxyAppended() {
        assertThat(new ClientIpResolver(1).resolve(request("10.0.0.2", "203.0.113.7")))
            .isEqualTo("203.0.113.7");
    }

    @Test void ignoresEntriesTheCallerPrependedItself() {
        // The caller sends a forged chain; the proxy appends what it actually saw. With one trusted
        // proxy the real client is the last entry, so the forged prefix changes nothing.
        var resolver = new ClientIpResolver(1);
        assertThat(resolver.resolve(request("10.0.0.2", "1.1.1.1, 2.2.2.2, 203.0.113.7")))
            .isEqualTo("203.0.113.7");
        assertThat(resolver.resolve(request("10.0.0.2", "9.9.9.9, 203.0.113.7")))
            .isEqualTo("203.0.113.7");
    }

    @Test void fallsBackToTheSocketAddressWhenTheChainIsShorterThanExpected() {
        assertThat(new ClientIpResolver(2).resolve(request("10.0.0.2", "203.0.113.7")))
            .isEqualTo("10.0.0.2");
        assertThat(new ClientIpResolver(1).resolve(request("10.0.0.2", null)))
            .isEqualTo("10.0.0.2");
        assertThat(new ClientIpResolver(1).resolve(request("10.0.0.2", "   ")))
            .isEqualTo("10.0.0.2");
    }

    @Test void ignoresTheHeaderEntirelyWithoutAProxyInFront() {
        assertThat(new ClientIpResolver(0).resolve(request("198.51.100.4", "203.0.113.7")))
            .isEqualTo("198.51.100.4");
    }

    @Test void capsTheValueSoItCannotBloatTheRateLimitKey() {
        var forged = "x".repeat(5000);
        assertThat(new ClientIpResolver(1).resolve(request("10.0.0.2", forged))).hasSize(45);
    }
}
