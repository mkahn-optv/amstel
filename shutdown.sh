#!/usr/bin/env bash
kill $(ps aux | grep '[s]ails lift' | awk '{print $2}')
