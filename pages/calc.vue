<script setup lang="ts">
import { computed } from "vue";
const currentDate = new Date();
const PER_DAY = 200_000;
const LIVE = 3_500_000;

const isWeekendOrEvent = (date: Date) => {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return true;
  }
  // event day in vietnam
  const eventDays = [
    '01-01',
    '30-04',
    '01-05',
    '02-09',
  ];
  const dayMonth = `${date.getDate()}-${date.getMonth() + 1}`;
  if (eventDays.includes(dayMonth)) {
    return true;
  }

  return false;
};

const nextMonth = computed(() => {
  const currentDate = new Date();
  let nextMonthDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    5
  );
  while (isWeekendOrEvent(nextMonthDay)) {
    nextMonthDay.setDate(nextMonthDay.getDate() - 1);
  }
  return nextMonthDay;
});

const diffDateInclude2Day = computed(() => {
  const diff = Math.abs(
    nextMonth.value.getTime() - currentDate.getTime()
  );
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays + 1; // include 2 day
});

const formatDisplayDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
};


const getDay = (date: Date) => {
  const days = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ]
  const day = date.getDay();
  return days[day];
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<template>
  <main
    class="min-h-screen text-gray-800 dark:text-gray-100 p-container z-10 pt-10"
  >
    <h2>Today is: {{formatDisplayDate(currentDate) }}</h2>
    <h2>Next month is: {{formatDisplayDate(nextMonth) }} at {{getDay(nextMonth)}}</h2>
    <h2>Diff date include 2 day: {{ diffDateInclude2Day }}</h2>
    <h2>Eat: {{ diffDateInclude2Day }} x {{ formatNumber(PER_DAY) }} = {{ formatNumber(diffDateInclude2Day * PER_DAY) }}</h2>
    <h2>Live: {{ formatNumber(LIVE) }}</h2>
    <h2>Total: {{ formatNumber(diffDateInclude2Day * PER_DAY + LIVE) }}</h2>
  </main>
</template>
