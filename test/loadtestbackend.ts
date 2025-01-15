import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 500,
    duration: '30s',
};

export default function () {
    const res = http.get(`http://localhost:3000/currencies`, {
        headers: {
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InBraS03OTYwMDY1MzU0NjM1NDYyMDg0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL3Byby05Mjc0MTg3MTYxMjcyOTA5NTMyLmZyb250ZW5kYXBpLmNvcmJhZG8uaW8iLCJzdWIiOiJ1c3ItNjM3NzQyNTQxMzMwODgzMTE2NCIsImV4cCI6MTczNzAwNTE0OSwibmJmIjoxNzM2OTE4NzM5LCJpYXQiOjE3MzY5MTg3NDksImp0aSI6InRaclI1ZlFhZHJWZ0hXeWV4bjNTOXdKdmVLd0RhVSIsIm9yaWciOiJ0ZXN0QHN2cy5wbSIsImVtYWlsIjoidGVzdEBzdnMucG0iLCJ2ZXJzaW9uIjoyfQ.RiW_aqBXXehbaCglMG_SLb6Kf8Awc1sbW3XzGaWo5e-AHbm50AKHu-cuca3rP1fzwO7cmwHJYnshEIzTQ6YFtNZ-qurjMPKbe1q2yhvvefqLh7HX3uvQgI308azAk6udhVTl4jB9vkfg01pY5OaIPelUBklMY2G8U3yDaRtESiiBgFO2Ts33MDZhggNmmUkxnAaYgTg2J8ZZr-KlrRFy2FpbXQidEyZYKTiBTul_u75YQn16cDQDWtBUMExSVwHfeb5bzi7IbM6ey3KGUzBJT3yF6aIX020V98WIbA7YeOXSm8DvLD75piZHDrJia0oOy7AzHM2uMq0N6YmptMYtVg"
        }
    });
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    sleep(1);
}
