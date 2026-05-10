#!/bin/bash

# 生产环境健康检查脚本
# 用法: ./scripts/health-check.sh

BASE_URL="https://yyu-2026.vercel.app"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
TOTAL=0
PASSED=0
FAILED=0

echo -e "${BLUE}🚀 Starting Production Health Check${NC}"
echo -e "${BLUE}Base URL: $BASE_URL${NC}\n"

# 测试函数
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    TOTAL=$((TOTAL + 1))
    
    echo -e "${BLUE}Testing: $name${NC}"
    
    # 发送请求并获取状态码
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url")
    
    # 检查状态码
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ $name - Status: $status_code - Time: ${response_time}s${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ $name - Status: $status_code (Expected: $expected_status) - Time: ${response_time}s${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# 1. 测试页面
echo -e "\n${YELLOW}📄 Testing Pages${NC}\n"
test_endpoint "Homepage" "$BASE_URL/"
test_endpoint "Services Page" "$BASE_URL/services"
test_endpoint "Lawyers Page" "$BASE_URL/lawyers"
test_endpoint "About Page" "$BASE_URL/about"
test_endpoint "Contact Page" "$BASE_URL/contact"
test_endpoint "Login Page" "$BASE_URL/auth/login"

# 2. 测试 API
echo -e "\n${YELLOW}🔌 Testing API Endpoints${NC}\n"
test_endpoint "Public Tenant Config API" "$BASE_URL/api/public/tenant-config"

# 3. 测试 404
echo -e "\n${YELLOW}🔍 Testing 404 Handling${NC}\n"
test_endpoint "404 Page" "$BASE_URL/this-page-does-not-exist" 404

# 4. 性能测试
echo -e "\n${YELLOW}⚡ Performance Test${NC}\n"
echo -e "${BLUE}Testing homepage load time (5 iterations)${NC}"

total_time=0
for i in {1..5}; do
    time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/")
    total_time=$(echo "$total_time + $time" | bc)
    echo "  Iteration $i: ${time}s"
done

avg_time=$(echo "scale=3; $total_time / 5" | bc)
echo -e "${BLUE}Average load time: ${avg_time}s${NC}"

if (( $(echo "$avg_time < 1.0" | bc -l) )); then
    echo -e "${GREEN}✅ Performance: Excellent (< 1s)${NC}"
elif (( $(echo "$avg_time < 2.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Performance: Good (< 2s)${NC}"
elif (( $(echo "$avg_time < 3.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Performance: Acceptable (< 3s)${NC}"
else
    echo -e "${RED}❌ Performance: Poor (> 3s)${NC}"
    FAILED=$((FAILED + 1))
fi

# 5. 安全 Headers 检查
echo -e "\n${YELLOW}🔒 Security Headers Check${NC}\n"

headers=$(curl -s -I "$BASE_URL")

check_header() {
    local header_name=$1
    if echo "$headers" | grep -qi "$header_name"; then
        echo -e "${GREEN}✅ $header_name: Found${NC}"
    else
        echo -e "${YELLOW}⚠️  $header_name: Not found${NC}"
    fi
}

check_header "x-frame-options"
check_header "x-content-type-options"
check_header "content-security-policy"
check_header "referrer-policy"

# 6. 测试总结
echo -e "\n${BLUE}📊 Test Summary${NC}\n"
echo -e "${BLUE}Total Tests: $TOTAL${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

success_rate=$(echo "scale=2; $PASSED * 100 / $TOTAL" | bc)
echo -e "${BLUE}Success Rate: ${success_rate}%${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}\n"
    exit 0
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Please review the results.${NC}\n"
    exit 1
fi
