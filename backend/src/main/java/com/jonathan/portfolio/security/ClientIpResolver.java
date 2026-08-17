package com.jonathan.portfolio.security;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Resolves the caller's address for rate limiting.
 *
 * <p>{@code X-Forwarded-For} is a list any client can start: a caller that sends
 * {@code X-Forwarded-For: 203.0.113.9} makes that value the leftmost entry, and every proxy in
 * front of us only ever appends. Reading the leftmost entry therefore reads attacker input, and a
 * caller that changes it on each request gets a fresh rate-limit bucket every time.
 *
 * <p>Only the rightmost entries are trustworthy, because our own proxies wrote them. With
 * {@code n} proxies between the client and this service, the real client sits at
 * {@code size - n}. Anything shorter than expected means the header did not come through our
 * chain, so we fall back to the socket address, which cannot be forged.
 */
@Component
public class ClientIpResolver {
    private static final String HEADER = "X-Forwarded-For";
    private static final int MAX_LENGTH = 45; // an IPv6 address with an embedded IPv4 suffix

    private final int trustedProxyCount;

    public ClientIpResolver(@Value("${app.security.trusted-proxy-count:1}") int trustedProxyCount) {
        this.trustedProxyCount = Math.max(0, trustedProxyCount);
    }

    public String resolve(HttpServletRequest request) {
        var remote = request.getRemoteAddr();
        if (trustedProxyCount == 0) return truncate(remote);
        var header = request.getHeader(HEADER);
        if (header == null || header.isBlank()) return truncate(remote);
        var hops = Arrays.stream(header.split(",")).map(String::trim).filter(hop -> !hop.isEmpty()).toList();
        var index = hops.size() - trustedProxyCount;
        if (index < 0 || index >= hops.size()) return truncate(remote);
        return truncate(hops.get(index));
    }

    private static String truncate(String value) {
        if (value == null || value.isBlank()) return "unknown";
        return value.length() <= MAX_LENGTH ? value : value.substring(0, MAX_LENGTH);
    }
}
